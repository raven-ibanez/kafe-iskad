-- Restructure Chicken Poppers into Price Tiers with Flavor Variations
-- Description: Consolidates redundant menu items and adds specific flavors as selectable variations

DO $$
DECLARE
  v_classic_id uuid;
  v_signature_id uuid;
  v_premium_id uuid;
BEGIN
  -- 1. Remove existing chicken poppers items to avoid duplication/confusion
  DELETE FROM menu_items WHERE category = 'chicken-poppers';

  -- 2. Create Classic Tier (₱189)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Classic Chicken Poppers', 'Crispy chicken poppers with your choice of classic flavor.', 189, 'chicken-poppers', true, true)
  RETURNING id INTO v_classic_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_classic_id, 'Teriyaki', 0),
    (v_classic_id, 'Soy Garlic', 0),
    (v_classic_id, 'Buttered Garlic Parmesan', 0);

  -- 3. Create Signature Tier (₱229)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Signature Chicken Poppers', 'Our signature chicken poppers in specialized bold flavors.', 229, 'chicken-poppers', true, true)
  RETURNING id INTO v_signature_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_signature_id, 'Famous Orange', 0),
    (v_signature_id, 'Salted Egg', 0),
    (v_signature_id, 'Snow Cheese', 0),
    (v_signature_id, 'Yangnyeom', 0);

  -- 4. Create Premium Tier (₱249)
  INSERT INTO menu_items (name, description, base_price, category, popular, available)
  VALUES ('Premium Chicken Poppers', 'Indulgent premium chicken poppers for the ultimate treat.', 249, 'chicken-poppers', false, true)
  RETURNING id INTO v_premium_id;

  INSERT INTO variations (menu_item_id, name, price) VALUES
    (v_premium_id, 'Truffle Honey', 0),
    (v_premium_id, 'Honey Garlic', 0),
    (v_premium_id, 'Honey Walnut', 0);

END $$;
