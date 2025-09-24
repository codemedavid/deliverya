-- Sync website categories into admin dashboard categories table
-- Ensures these categories exist with consistent ordering and are active

INSERT INTO categories (id, name, icon, sort_order, active)
VALUES
  ('personal-care', 'Personal Care', '🧴', 1, true),
  ('laundry-items', 'Laundry Items', '🧺', 2, true),
  ('adult-care', 'Adult Care', '👴', 3, true),
  ('tea-coffee', 'Tea & Coffee', '☕', 4, true),
  ('beverages', 'Beverages', '🥤', 5, true),
  ('snacks', 'Snacks', '🍿', 6, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;


