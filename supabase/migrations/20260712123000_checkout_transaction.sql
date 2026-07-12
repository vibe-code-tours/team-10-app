CREATE OR REPLACE FUNCTION create_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_total_amount numeric,
  p_payment_method text,
  p_payment_receipt_url text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_qty int;
  v_price numeric;
  v_current_stock int;
BEGIN
  -- Insert the order
  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    payment_method,
    payment_receipt_url
  )
  VALUES (
    p_user_id,
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_total_amount,
    p_payment_method,
    p_payment_receipt_url
  )
  RETURNING id INTO v_order_id;

  -- Loop through items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::int;
    v_price := (v_item->>'price')::numeric;

    -- Lock the row and check stock
    SELECT stock INTO v_current_stock
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
    END IF;

    -- Decrement stock
    UPDATE public.products
    SET stock = stock - v_qty
    WHERE id = v_product_id;

    -- Insert order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price
    )
    VALUES (
      v_order_id,
      v_product_id,
      v_qty,
      v_price
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;
