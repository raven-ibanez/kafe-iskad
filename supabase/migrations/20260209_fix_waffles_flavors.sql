-- Refined Restructure for Waffles into Price Tiers with Flavor Variations
-- Description: Consolidates redundant waffle items and adds specific flavors as selectable variations with price offsets

DO $$
DECLARE
  v_tier1_id uuid;
  v_tier2_id uuid;
  v_tier3_id uuid;
  v_tier4_id uuid;
BEGIN
  -- 1. Remove previously created waffle items to avoid duplication
  DELETE FROM variations WHERE menu_item_id IN (
    SELECT id FROM menu_items WHERE category = 'waffles-fries-sides' AND (name LIKE 'Waffle Tier%' OR name LIKE '%Waffle')
  );
  DELETE FROM menu_items WHERE category = 'waffles-fries-sides' AND (name LIKE 'Waffle Tier%' OR name LIKE '%Waffle');

  -- 2. Tier 1 (₱79)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Waffle Tier 1', 'Classic waffle favorites.', 79, 'waffles-fries-sides', false, true)
  RETURNING id INTO v_tier1_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_tier1_id, 'Classic', 0),
    (v_tier1_id, 'Caramel', 0),
    (v_tier1_id, 'Chocolate', 0),
    (v_tier1_id, 'Salted Caramel', 0),
    (v_tier1_id, 'Nutella', 10); -- 89

  -- 3. Tier 2 (₱99)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Waffle Tier 2', 'Indulgent rich flavors.', 99, 'waffles-fries-sides', true, true)
  RETURNING id INTO v_tier2_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_tier2_id, 'Belgian Choco Oreo', 0),
    (v_tier2_id, 'Triple Choco', 0),
    (v_tier2_id, 'S''mores', 0),
    (v_tier2_id, 'French Butter Caramel', 0);

  -- 4. Tier 3 (₱109)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Waffle Tier 3', 'Premium flavors for a sweet treat.', 109, 'waffles-fries-sides', false, true)
  RETURNING id INTO v_tier3_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_tier3_id, 'Nutella Biscoff', 0),
    (v_tier3_id, 'Nutella Alcapone', 0),
    (v_tier3_id, 'Biscoff Alcapone', 0),
    (v_tier3_id, 'Blueberry Creamcheese', 0),
    (v_tier3_id, 'Strawberry', 0),
    (v_tier3_id, 'Creamcheese', 10), -- 119
    (v_tier3_id, 'Nutella Creamcheese', 10); -- 119

  -- 5. Tier 4 (₱119)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Waffle Tier 4', 'Ultimate cream-filled waffles.', 119, 'waffles-fries-sides', false, true)
  RETURNING id INTO v_tier4_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_tier4_id, 'Nutella Cream', 0),
    (v_tier4_id, 'Biscoff Cream', 0),
    (v_tier4_id, 'Strawberry Cream', 0),
    (v_tier4_id, 'Blueberry Cream', 0),
    (v_tier4_id, 'Biscoff Apple Streusel', 10); -- 129

END $$;
