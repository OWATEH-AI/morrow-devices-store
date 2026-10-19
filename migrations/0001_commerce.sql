CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  fulfillment_method text NOT NULL CHECK (fulfillment_method IN ('delivery', 'pickup')),
  delivery_address jsonb,
  delivery_instructions text,
  order_status text NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'ready_for_pickup', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'store_pickup', 'provider')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refund_pending', 'refunded')),
  subtotal_paise bigint NOT NULL CHECK (subtotal_paise >= 0),
  delivery_fee_paise bigint NOT NULL DEFAULT 0 CHECK (delivery_fee_paise >= 0),
  total_paise bigint NOT NULL CHECK (total_paise >= 0),
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_paise = subtotal_paise + delivery_fee_paise),
  CHECK ((fulfillment_method = 'delivery' AND delivery_address IS NOT NULL) OR fulfillment_method = 'pickup')
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  product_slug text NOT NULL,
  variant_id text NOT NULL,
  product_name_snapshot text NOT NULL,
  brand_snapshot text NOT NULL,
  sku_snapshot text NOT NULL,
  variant_snapshot jsonb NOT NULL,
  unit_price_paise bigint NOT NULL CHECK (unit_price_paise >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total_paise bigint NOT NULL CHECK (line_total_paise = unit_price_paise * quantity)
);

CREATE TABLE order_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  from_status text,
  to_status text NOT NULL,
  actor_id text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inventory (
  sku text PRIMARY KEY,
  product_slug text NOT NULL,
  variant_id text NOT NULL,
  on_hand integer NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
  reserved integer NOT NULL DEFAULT 0 CHECK (reserved >= 0 AND reserved <= on_hand),
  low_stock_threshold integer NOT NULL DEFAULT 2 CHECK (low_stock_threshold >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inventory_movements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL REFERENCES inventory(sku) ON DELETE RESTRICT,
  quantity_delta integer NOT NULL CHECK (quantity_delta <> 0),
  movement_type text NOT NULL CHECK (movement_type IN ('receipt', 'adjustment', 'reservation', 'release', 'sale', 'return')),
  reason text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,
  actor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX orders_status_created_idx ON orders (order_status, created_at DESC);
CREATE INDEX order_items_order_id_idx ON order_items (order_id);
CREATE INDEX order_status_history_order_idx ON order_status_history (order_id, created_at);
CREATE INDEX inventory_low_stock_idx ON inventory (updated_at) WHERE on_hand - reserved <= low_stock_threshold;