-- seed.sql
-- Insert 20 realistic mock products

INSERT INTO public.products (title, description, price, stock, category, image_url)
VALUES
  ('iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max, 256GB, Natural Titanium. A17 Pro chip, aerospace-grade titanium design.', 1199.99, 15, 'electronics', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80'),
  ('MacBook Pro 14"', 'Apple M3 Pro chip with 11-core CPU and 14-core GPU. 18GB Unified Memory, 512GB SSD.', 1999.00, 8, 'electronics', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'),
  ('Sony WH-1000XM5', 'Wireless Noise Canceling Headphones. Over-ear design with 30-hour battery life.', 348.00, 25, 'electronics', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'),
  ('Samsung Galaxy S24 Ultra', 'AI-powered smartphone with titanium exterior, 200MP camera, and built-in S Pen.', 1299.99, 12, 'electronics', 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&q=80'),
  ('iPad Air (M1)', 'Lightweight and powerful tablet with Apple M1 chip, 10.9-inch Liquid Retina display.', 599.00, 30, 'electronics', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'),
  
  ('Classic White T-Shirt', 'Premium 100% cotton classic crewneck t-shirt. Soft, breathable, and pre-shrunk.', 25.00, 100, 'clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'),
  ('Vintage Denim Jacket', 'Classic blue denim jacket with button closure and chest pockets. Regular fit.', 89.99, 40, 'clothing', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80'),
  ('Men''s Chino Pants', 'Comfortable stretch chino pants for everyday wear. Slim fit, khaki color.', 45.50, 60, 'clothing', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80'),
  ('Women''s Summer Dress', 'Lightweight floral summer dress with adjustable straps. Perfect for warm weather.', 55.00, 35, 'clothing', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'),
  ('Cozy Wool Hoodie', 'Thick, warm wool-blend hoodie with front pocket and drawstring hood. Dark grey.', 65.00, 50, 'clothing', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'),

  ('Nike Air Force 1', 'Classic white sneakers. Crisp leather, stitched overlays, and bold accents.', 115.00, 45, 'accessories', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'),
  ('Leather Minimalist Wallet', 'Handcrafted genuine leather wallet with RFID blocking and slim profile.', 35.00, 80, 'accessories', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'),
  ('Ray-Ban Aviator Sunglasses', 'Classic aviator sunglasses with gold frame and green classic G-15 lenses.', 163.00, 20, 'accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'),
  ('Herschel Classic Backpack', 'Durable everyday backpack with signature striped fabric liner and front pocket.', 49.99, 55, 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'),
  ('Apple Watch Series 9', 'Smartwatch with Always-On Retina display, ECG app, and blood oxygen sensor.', 399.00, 25, 'accessories', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80'),

  ('Kindle Paperwhite', 'Waterproof e-reader with a 6.8" display, adjustable warm light, and 8GB storage.', 139.99, 40, 'electronics', 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80'),
  ('Logitech MX Master 3S', 'Advanced wireless mouse with ultra-fast scrolling and ergonomic design.', 99.99, 65, 'electronics', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'),
  ('Keychron K2 Mechanical Keyboard', 'Compact wireless mechanical keyboard with tactile brown switches and RGB backlight.', 79.00, 30, 'electronics', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'),
  ('Yeti Rambler 20 oz Tumbler', 'Stainless steel, vacuum insulated tumbler with MagSlider lid. Keeps drinks hot or cold.', 35.00, 100, 'accessories', 'https://images.unsplash.com/photo-1614917631189-9eb7c569ffcd?w=800&q=80'),
  ('Moleskine Classic Notebook', 'Hard cover notebook with ruled pages, elastic closure, and bookmark ribbon.', 22.95, 120, 'accessories', 'https://images.unsplash.com/photo-1531346878377-3e5f29d2f2d9?w=800&q=80');
