import { guestCartSchema } from "@/lib/validations/cart";

describe("Guest Cart Schema Validation", () => {
  it("should validate guest cart items with product_id and title", () => {
    const rawCart = [
      {
        product_id: "123e4567-e89b-12d3-a456-426614174000",
        quantity: 2,
        title: "Wireless Headphones",
        price: 29.99,
        image_url: "https://example.com/item.jpg",
        stock: 10,
      },
    ];

    const result = guestCartSchema.safeParse(rawCart);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0]).toEqual({
        product_id: "123e4567-e89b-12d3-a456-426614174000",
        quantity: 2,
        title: "Wireless Headphones",
      });
    }
  });

  it("should transform guest cart items stored with 'id' from localStorage into 'product_id'", () => {
    const localStorageCart = [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Bluetooth Speaker",
        price: 49.99,
        image_url: "https://example.com/speaker.jpg",
        quantity: 1,
        stock: 5,
      },
    ];

    const result = guestCartSchema.safeParse(localStorageCart);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0].product_id).toBe(
        "123e4567-e89b-12d3-a456-426614174000",
      );
      expect(result.data[0].title).toBe("Bluetooth Speaker");
      expect(result.data[0].quantity).toBe(1);
    }
  });

  it("should fallback 'name' to 'title' if 'title' is missing in raw item", () => {
    const rawCartWithName = [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Smart Watch",
        quantity: 3,
      },
    ];

    const result = guestCartSchema.safeParse(rawCartWithName);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0].title).toBe("Smart Watch");
    }
  });

  it("should reject items without a valid UUID id or product_id", () => {
    const invalidCart = [
      {
        quantity: 2,
        title: "Invalid Item",
      },
    ];

    const result = guestCartSchema.safeParse(invalidCart);
    expect(result.success).toBe(false);
  });
});
