-- Add Milo Series and Juice & Tea to Specialty Beverages
-- Description: Adds new beverage items with their respective prices and variations

DO $$
DECLARE
  v_milo_dino_id uuid;
  v_category_id text := 'specialty-beverages';
BEGIN
  -- 1. Milo Series
  -- Milo Dino (79/99)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Milo Dino', 'Classic Milo topped with Milo powder.', 79, v_category_id, true, true)
  RETURNING id INTO v_milo_dino_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_milo_dino_id, '16oz', 0),
    (v_milo_dino_id, '22oz', 20);

  -- Sea Salt Milo (139 - 22oz)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Sea Salt Milo', 'Milo topped with signature sea salt cream. (22oz)', 139, v_category_id, false, true);

  -- 2. Juice & Tea
  INSERT INTO menu_items (name, description, base_price, category, available) VALUES
    ('Red Iced Tea', 'Refreshing red iced tea.', 39, v_category_id, true),
    ('Lemon Iced Tea', 'Classic lemon flavored iced tea.', 49, v_category_id, true),
    ('Orange Juice', 'Sweet and refreshing orange juice.', 59, v_category_id, true),
    ('Pineapple Juice', 'Tropical pineapple juice.', 59, v_category_id, true),
    ('Wintermelon Juice', 'Cool wintermelon juice.', 59, v_category_id, true);

END $$;
