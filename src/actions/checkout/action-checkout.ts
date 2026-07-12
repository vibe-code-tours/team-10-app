"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const CustomerSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long"),
  customer_phone: z.string().trim().min(5, "Please enter a valid phone number"),
  customer_address: z
    .string()
    .trim()
    .min(5, "Please enter a complete delivery address"),
  payment_method: z.string().min(1, "Please select a payment method"),
});

export type CheckoutResult = {
  error?: string;
  success?: boolean;
  orderId?: string;
};

type CustomerDetails = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
};

type CartItem = { id: string; quantity: number; price: number };

// Helper 1: Validate input
function validateCartItems(items: CartItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (items.length > 50) {
    return {
      error: "You cannot checkout with more than 50 unique items at once.",
    };
  }
  const requested = new Map<string, number>();
  for (const item of items) {
    if (!item?.id || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { error: "Invalid cart item." };
    }
    requested.set(item.id, (requested.get(item.id) ?? 0) + item.quantity);
  }
  return { requested };
}

// Helper 2: Verify prices and stock
async function verifyPricesAndStock(
  supabase: SupabaseClient,
  requested: Map<string, number>,
  clientTotalAmount: number,
) {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, stock, title")
    .in("id", Array.from(requested.keys()));

  if (productsError || !products) {
    console.error("Checkout price lookup error:", productsError);
    return { error: "Failed to verify your order. Please try again." };
  }

  if (products.length !== requested.size) {
    return { error: "One or more products are no longer available." };
  }

  let serverTotal = 0;
  const priceById = new Map<string, number>();

  for (const product of products) {
    const qty = requested.get(product.id)!;
    if (product.stock < qty) {
      return { error: `"${product.title}" is out of stock.` };
    }
    priceById.set(product.id, product.price);
    serverTotal += product.price * qty;
  }

  if (clientTotalAmount !== serverTotal) {
    console.warn(
      `Checkout total mismatch: client sent ${clientTotalAmount}, server computed ${serverTotal}. Using server total.`,
    );
  }

  return { serverTotal, priceById, products };
}

// Helper 3: Process the order transaction
async function processOrderTransaction(
  supabase: SupabaseClient,
  userId: string | null,
  customerDetails: CustomerDetails,
  items: CartItem[],
  serverTotal: number,
  priceById: Map<string, number>,
  requested: Map<string, number>,
  products: { id: string; price: number; stock: number; title: string }[],
) {
  const itemsJson = Array.from(requested.entries()).map(
    ([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)!;
      return {
        product_id: productId,
        quantity,
        price: product.price,
      };
    },
  );

  const adminClient = await createAdminClient();
  const { data: orderId, error: rpcError } = await adminClient.rpc(
    "create_order",
    {
      p_user_id: userId,
      p_customer_name: customerDetails.customer_name,
      p_customer_phone: customerDetails.customer_phone,
      p_customer_address: customerDetails.customer_address,
      p_total_amount: serverTotal,
      p_payment_method: customerDetails.payment_method,
      p_payment_receipt_url: null,
      p_items: itemsJson,
    },
  );

  if (rpcError) {
    console.error("Order RPC Error:", rpcError);
    return { error: "Failed to process order. Please try again." };
  }

  return { success: true, orderId: orderId };
}

export async function createOrder(
  customerDetails: CustomerDetails,
  items: CartItem[],
  totalAmount: number,
): Promise<CheckoutResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Validate items and customer details
    const { requested, error: validationError } = validateCartItems(items);
    if (validationError || !requested) return { error: validationError };

    const parsedCustomer = CustomerSchema.safeParse(customerDetails);
    if (!parsedCustomer.success) {
      return { error: parsedCustomer.error.issues[0].message };
    }
    const validatedCustomer = parsedCustomer.data;

    // 2. Verify prices and stock
    const {
      error: verifyError,
      serverTotal,
      priceById,
      products,
    } = await verifyPricesAndStock(supabase, requested, totalAmount);
    if (verifyError || serverTotal === undefined || !priceById || !products)
      return { error: verifyError };

    // 3. Process Transaction
    return await processOrderTransaction(
      supabase,
      user?.id || null,
      validatedCustomer,
      items,
      serverTotal,
      priceById,
      requested,
      products,
    );
  } catch (err: unknown) {
    console.error("createOrder error:", err);
    return { error: "Something went wrong while placing your order." };
  }
}
