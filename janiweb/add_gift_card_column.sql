-- ==============================================================================
-- ADD GIFT CARD SUPPORT
-- ==============================================================================

-- 1. Add is_gift_card column
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_gift_card BOOLEAN DEFAULT false;

-- 2. Update RLS policies (just to be safe, though existing ones handle "all columns" usually)
-- The previous "Admins can manage coupons" policy cover ALL operations so it should auto-include new columns.
-- But we can refresh it if needed. For now, just adding the column is usually enough.

-- 3. Notify
DO $$
BEGIN
    RAISE NOTICE 'Column is_gift_card added successfully';
END $$;
