import { createOrder } from "@/actions/checkout/action-checkout";
import {
  createAdminClient,
  createClient,
} from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
  createAdminClient: jest.fn(),
}));

const customerDetails = {
  customer_name: "John Doe",
  customer_phone: "09123456789",
  customer_address: "123 Main St, Yangon",
  payment_method: "cod",
};

const product = {
  id: "prod-1",
  price: 1000,
  stock: 10,
  title: "Test Product",
};

describe("Action: createOrder", () => {
  const getUser = jest.fn();
  const productsIn = jest.fn();
  const rpc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockResolvedValue({ data: { user: { id: "user-123" } } });
    productsIn.mockResolvedValue({ data: [product], error: null });
    rpc.mockResolvedValue({ data: "order-123", error: null });

    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser },
      from: jest.fn(() => ({
        select: jest.fn(() => ({ in: productsIn })),
      })),
    });
    (createAdminClient as jest.Mock).mockResolvedValue({ rpc });
  });

  it("rejects invalid customer data", async () => {
    const result = await createOrder(
      {
        customer_name: "J",
        customer_phone: "1234",
        customer_address: "Home",
        payment_method: "",
      },
      [{ id: product.id, quantity: 2, price: product.price }],
      2000,
    );

    expect(result).toHaveProperty("error");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects more than 50 unique cart entries", async () => {
    const massiveItems = Array.from({ length: 60 }, (_, index) => ({
      id: `prod-${index}`,
      quantity: 1,
      price: 100,
    }));

    const result = await createOrder(customerDetails, massiveItems, 6000);

    expect(result).toEqual({
      error: "You cannot checkout with more than 50 unique items at once.",
    });
    expect(productsIn).not.toHaveBeenCalled();
  });

  it("uses server prices and aggregates duplicate product IDs", async () => {
    const result = await createOrder(
      customerDetails,
      [
        { id: product.id, quantity: 1, price: 1 },
        { id: product.id, quantity: 1, price: 1 },
      ],
      2,
    );

    expect(result).toEqual({ success: true, orderId: "order-123" });
    expect(rpc).toHaveBeenCalledWith("create_order", {
      p_user_id: "user-123",
      p_customer_name: customerDetails.customer_name,
      p_customer_phone: customerDetails.customer_phone,
      p_customer_address: customerDetails.customer_address,
      p_total_amount: 2000,
      p_payment_method: customerDetails.payment_method,
      p_payment_receipt_url: null,
      p_items: [{ product_id: product.id, quantity: 2, price: 1000 }],
    });
  });

  it("supports guest checkout", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await createOrder(
      customerDetails,
      [{ id: product.id, quantity: 1, price: product.price }],
      product.price,
    );

    expect(result.success).toBe(true);
    expect(rpc).toHaveBeenCalledWith(
      "create_order",
      expect.objectContaining({ p_user_id: null }),
    );
  });

  it("rejects missing products", async () => {
    productsIn.mockResolvedValueOnce({ data: [], error: null });

    const result = await createOrder(
      customerDetails,
      [{ id: product.id, quantity: 1, price: product.price }],
      product.price,
    );

    expect(result).toEqual({
      error: "One or more products are no longer available.",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects insufficient stock", async () => {
    productsIn.mockResolvedValueOnce({
      data: [{ ...product, stock: 1 }],
      error: null,
    });

    const result = await createOrder(
      customerDetails,
      [{ id: product.id, quantity: 2, price: product.price }],
      product.price * 2,
    );

    expect(result).toEqual({ error: '"Test Product" is out of stock.' });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("handles product lookup failures", async () => {
    productsIn.mockResolvedValueOnce({
      data: null,
      error: { message: "lookup failed" },
    });

    const result = await createOrder(
      customerDetails,
      [{ id: product.id, quantity: 1, price: product.price }],
      product.price,
    );

    expect(result).toEqual({
      error: "Failed to verify your order. Please try again.",
    });
  });

  it("handles transaction failures without reporting success", async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "transaction rolled back" },
    });

    const result = await createOrder(
      customerDetails,
      [{ id: product.id, quantity: 1, price: product.price }],
      product.price,
    );

    expect(result).toEqual({
      error: "Failed to process order. Please try again.",
    });
  });
});
