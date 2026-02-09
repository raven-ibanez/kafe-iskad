-- Kafe Sikad Menu Migration
-- Generated on: 2026-02-08

-- 1. Create Categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('chicken-poppers', 'Chicken Poppers', '🍗', 1, true),
  ('all-day-breakfast', 'All-Day Breakfast', '🍳', 2, true),
  ('coffee-black', 'Coffee & Black', '☕', 3, true),
  ('specialty-beverages', 'Specialty Beverages', '✨', 4, true),
  ('waffles-fries-sides', 'Waffles, Fries & Sides', '🧇', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Chicken Poppers
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Chicken Poppers (Teriyaki/Soy Garlic/Garlic Parmesan)', 'Flavors: Teriyaki, Soy Garlic, Buttered Garlic Parmesan', 189, 'chicken-poppers', true, true),
  ('Famous Orange Chicken', 'Our signature orange chicken poppers', 229, 'chicken-poppers', true, true),
  ('Chicken Poppers (Salted Egg/Snow Cheese/Yangnyeom)', 'Flavors: Salted Egg, Snow Cheese, Yangnyeom', 229, 'chicken-poppers', false, true),
  ('Chicken Poppers (Truffle Honey/Honey Garlic/Honey Walnut)', 'Flavors: Truffle Honey, Honey Garlic, Honey Walnut', 249, 'chicken-poppers', false, true);

-- 3. All-Day Breakfast
-- Filipino Breakfast with variations
DO $$
DECLARE
  v_item_id uuid;
BEGIN
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Filipino Breakfast', 'Includes Garlic Fried Rice, Fried Egg, Peppery Corn, and Coffee', 149, 'all-day-breakfast', true, true)
  RETURNING id INTO v_item_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Tapa', 40),
    (v_item_id, 'Chicken', 40),
    (v_item_id, 'Pork', 40),
    (v_item_id, 'Bangus', 40),
    (v_item_id, 'Tocino', 0),
    (v_item_id, 'Hotdog', 0),
    (v_item_id, 'Maling', 0),
    (v_item_id, 'Longganisa', 0);
END $$;

INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('American Breakfast', 'Pancakes, Bacon, Eggs, Hashbrowns, and Coffee', 199, 'all-day-breakfast', false, true),
  ('European Breakfast', 'French Toasts, Ham, Bacon, French Fries, Eggs, and Coffee', 199, 'all-day-breakfast', false, true);

-- 4. Coffee & Black
-- Template for Hot/Iced variations
DO $$
DECLARE
  v_item_id uuid;
BEGIN
  -- Kafe Latte
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('Kafe Latte', 'Coffee with milk', 99, 'coffee-black', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Hot 16oz', 0), (v_item_id, 'Iced 16oz', 0), (v_item_id, 'Iced 22oz', 20);

  -- Mocha
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('Mocha', 'Coffee with chocolate', 109, 'coffee-black', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Hot 16oz', 0), (v_item_id, 'Iced 16oz', 0), (v_item_id, 'Iced 22oz', 20);

  -- White Mocha
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('White Mocha', 'Coffee with white chocolate', 109, 'coffee-black', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Hot 16oz', 0), (v_item_id, 'Iced 16oz', 0), (v_item_id, 'Iced 22oz', 20);

  -- Spanish Latte, Sea Salt Latte, Caramel Macchiato, Salted Caramel Macchiato, Sea Salt Caramel
  -- Base 119, 22oz +20
  FOR v_item_id IN 
    INSERT INTO menu_items (name, description, base_price, category, available) VALUES
    ('Spanish Latte', 'Sweetened latte', 119, 'coffee-black', true),
    ('Sea Salt Latte', 'Latte with sea salt cream', 119, 'coffee-black', true),
    ('Caramel Macchiato', 'Caramel coffee drink', 119, 'coffee-black', true),
    ('Salted Caramel Macchiato', 'Salted caramel coffee drink', 119, 'coffee-black', true),
    ('Sea Salt Caramel', 'Caramel drink with sea salt', 119, 'coffee-black', true)
    RETURNING id
  LOOP
    INSERT INTO variations (menu_item_id, name, price) VALUES
      (v_item_id, 'Hot 16oz', 0), (v_item_id, 'Iced 16oz', 0), (v_item_id, 'Iced 22oz', 20);
  END LOOP;
END $$;

-- Black Coffee
DO $$
DECLARE
  v_item_id uuid;
BEGIN
  -- Americano
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('Americano', 'Espresso with hot water/ice', 59, 'coffee-black', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Hot 8oz', 0), (v_item_id, 'Hot 16oz', 20), (v_item_id, 'Iced 16oz', 20), (v_item_id, 'Iced 22oz', 40);

  -- Americano Romano
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('Americano Romano', 'Espresso with lemon', 89, 'coffee-black', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, 'Iced 16oz', 0), (v_item_id, 'Iced 22oz', 30);

  -- Americano Vanilla, Black Brown Sugar
  FOR v_item_id IN 
    INSERT INTO menu_items (name, description, base_price, category, available) VALUES
    ('Americano Vanilla', 'Vanilla flavored black coffee', 69, 'coffee-black', true),
    ('Black Brown Sugar', 'Brown sugar flavored black coffee', 69, 'coffee-black', true)
    RETURNING id
  LOOP
    INSERT INTO variations (menu_item_id, name, price) VALUES
      (v_item_id, 'Hot 8oz', 0), (v_item_id, 'Hot 16oz', 20), (v_item_id, 'Iced 16oz', 20), (v_item_id, 'Iced 22oz', 50);
  END LOOP;
END $$;

-- 5. Specialty Beverages
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Barista Brew 001', 'Espresso, Sea Salt Cream, Caramel, Cinnamon', 149, 'specialty-beverages', true),
  ('Barista Brew 002', 'Espresso, Breve, Dulce Leche', 149, 'specialty-beverages', true);

-- Elite
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Elite: Nutella Latte', '22oz premium nutella latte', 149, 'specialty-beverages', true),
  ('Elite: Bisco-ffee Latte', '22oz premium biscoff latte', 149, 'specialty-beverages', true),
  ('Elite: Tres Leches Coffee', '22oz premium tres leches coffee', 149, 'specialty-beverages', true),
  ('Elite: Sikad''s Eispanner', '22oz signature eispanner', 149, 'specialty-beverages', true);

-- Frappes
DO $$
DECLARE
  v_item_id uuid;
BEGIN
  FOR v_item_id IN 
    INSERT INTO menu_items (name, description, base_price, category, available) VALUES
    ('Java Chip Drip Frappe', 'Blended coffee with java chips', 119, 'specialty-beverages', true),
    ('Dark Choco Loco Frappe', 'Blended dark chocolate', 119, 'specialty-beverages', true),
    ('Hey Milky Way Frappe', 'Creamy blended specialty', 119, 'specialty-beverages', true),
    ('Oreo Cheesecake Frappe', 'Oreo and cheesecake blended', 119, 'specialty-beverages', true),
    ('Cookies N'' Cream Frappe', 'Classic cookies and cream blend', 119, 'specialty-beverages', true),
    ('Salty Caramel Frappe', 'Salted caramel blend', 119, 'specialty-beverages', true),
    ('Taro Make It Xtra Frappe', 'Special taro blend', 119, 'specialty-beverages', true)
    RETURNING id
  LOOP
    INSERT INTO variations (menu_item_id, name, price) VALUES
      (v_item_id, '16oz', 0), (v_item_id, '22oz', 20);
  END LOOP;

  -- Biscoff Cheesecake
  INSERT INTO menu_items (name, description, base_price, category, available)
  VALUES ('Biscoff Cheesecake Frappe', 'Biscoff and cheesecake blend', 129, 'specialty-beverages', true)
  RETURNING id INTO v_item_id;
  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_item_id, '16oz', 0), (v_item_id, '22oz', 20);
END $$;

-- Fruit Frappe
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Fruit Frappe: Strawberry', '22oz Strawberry blend', 149, 'specialty-beverages', true),
  ('Fruit Frappe: Blueberry', '22oz Blueberry blend', 149, 'specialty-beverages', true),
  ('Fruit Frappe: Mango-Graham Delight', '22oz Mango graham blend', 149, 'specialty-beverages', true);

-- Mocktails
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Honey Lemon Drop Mocktail', 'Refreshing honey and lemon', 79, 'specialty-beverages', true),
  ('Bubbly Lychee Mocktail', 'Sparkling lychee drink', 79, 'specialty-beverages', true),
  ('Strawberry Lemonade Fizz', 'Strawberry and lemon sparkler', 99, 'specialty-beverages', true),
  ('Blue Citrus Rush', 'Citrus with blue curaçao syrup', 99, 'specialty-beverages', true),
  ('Pineapple Punch', 'Pineapple mocktail', 119, 'specialty-beverages', true),
  ('Tropical Breeze', 'Tropical fruit blend', 139, 'specialty-beverages', true);

-- 6. Waffles, Fries & Sides
-- Waffles by Tier
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Waffle Tier 1 (Classic/Caramel)', 'Classic choices like Plain or Caramel', 79, 'waffles-fries-sides', true),
  ('Waffle Tier 2 (S''mores/Triple Choco)', 'Rich choices like S''mores or Triple Choco', 99, 'waffles-fries-sides', true),
  ('Waffle Tier 3 (Nutella Biscoff/Blueberry)', 'Premium choices like Nutella Biscoff or Blueberry', 109, 'waffles-fries-sides', true),
  ('Waffle Tier 4 (Nutella Cream/Apple Streusel)', 'Ultimate choices like Nutella Cream or Apple Streusel', 119, 'waffles-fries-sides', true);

-- Breakfast Waffle
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Breakfast Waffle: Ham & Egg', 'Savory waffle with ham and egg', 149, 'waffles-fries-sides', true),
  ('Breakfast Waffle: Bacon & Egg', 'Savory waffle with bacon and egg', 149, 'waffles-fries-sides', true),
  ('Breakfast Waffle: Ham & Cheese', 'Savory waffle with ham and cheese', 149, 'waffles-fries-sides', true),
  ('Breakfast Waffle: Bacon Jam', 'Savory waffle with bacon jam', 189, 'waffles-fries-sides', true),
  ('Breakfast Waffle: Chix N'' Dips', 'Savory waffle with chicken poppers and dips', 189, 'waffles-fries-sides', true);

-- Fries
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Fries (Sour Cream/BBQ/Cheese)', 'Choice of Sour Cream, Barbeque, or Cheese', 49, 'waffles-fries-sides', true),
  ('Snow Cheese Fries', 'Fries topped with snow cheese', 69, 'waffles-fries-sides', true);
