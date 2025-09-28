-- Sync automotive battery categories into admin dashboard categories table
-- Ensures these categories exist with consistent ordering and are active

INSERT INTO categories (id, name, icon, sort_order, active)
VALUES
  ('car-batteries', 'Car Batteries', '🚗', 1, true),
  ('truck-batteries', 'Truck Batteries', '🚛', 2, true),
  ('marine-batteries', 'Marine Batteries', '⛵', 3, true),
  ('motorcycle-batteries', 'Motorcycle Batteries', '🏍️', 4, true),
  ('deep-cycle', 'Deep Cycle', '🔋', 5, true),
  ('accessories', 'Accessories', '🔧', 6, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;


