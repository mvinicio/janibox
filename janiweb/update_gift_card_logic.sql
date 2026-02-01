-- ==============================================================================
-- GIFT CARD BALANCE LOGIC
-- ==============================================================================

-- Create a secure function to handle coupon/gift card usage
-- If it's a Gift Card: Deduct the amount used from the balance.
-- If it's a Coupon: Just increment the usage count.

CREATE OR REPLACE FUNCTION public.process_coupon_usage(p_coupon_id UUID, p_order_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_discount_type TEXT;
    v_is_gift_card BOOLEAN;
    v_discount_value NUMERIC;
    v_amount_to_deduct NUMERIC;
BEGIN
    -- 1. Get current coupon details
    SELECT discount_type, is_gift_card, discount_value
    INTO v_discount_type, v_is_gift_card, v_discount_value
    FROM public.coupons
    WHERE id = p_coupon_id;

    -- 2. Logic
    IF v_is_gift_card = true THEN
        -- It is a Gift Card: Calculate how much to deduct
        -- Ensure we don't deduct more than what's on the card or more than the order cost
        -- Logic: The user pays 'p_order_amount'. The coupon covers part of it.
        -- BUT 'p_order_amount' passed from frontend usually is the TOTAL order value.
        -- We need to deduct based on how much was actually applied.
        
        -- Let's assume p_order_amount passed here is the AMOUNT COVERED BY THE COUPON.
        -- Frontend will calculate: applied_amount = Math.min(orderTotal, cardBalance)
        -- So we just deduct p_order_amount.
        
        UPDATE public.coupons
        SET 
            -- Deduct value but don't go below 0
            discount_value = GREATEST(0, discount_value - p_order_amount),
            used_count = COALESCE(used_count, 0) + 1,
            updated_at = NOW()
        WHERE id = p_coupon_id;
        
    ELSE
        -- Standard Coupon: Just increment usage, value stays same
        UPDATE public.coupons
        SET 
            used_count = COALESCE(used_count, 0) + 1,
            updated_at = NOW()
        WHERE id = p_coupon_id;
    END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.process_coupon_usage TO anon, authenticated, service_role;
