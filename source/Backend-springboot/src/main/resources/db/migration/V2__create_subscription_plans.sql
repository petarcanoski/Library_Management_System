INSERT INTO subscription_plans (
    plan_code, name, description, duration_days, price, currency,
    max_books_allowed, max_days_per_book, display_order, is_active, is_featured, badge_text, created_by,created_at
) VALUES
(
    'MONTHLY',
    'Monthly Plan',
    'Access to library for 1 month',
    30,
    33,
    'USD',
    5,
    14,
    1,
    TRUE,
    TRUE,
    NULL,
    'system',
    '2026-01-11 22:45:30'
),
(
    'QUARTERLY',
    'Quarterly Plan',
    'Access to library for 3 months with extended benefits',
    90,
    110,
    'USD',
    10,
    21,
    2,
    TRUE,
    TRUE,
    'Best Value',
    'system',
    '2026-01-11 22:45:30'
),
(
    'YEARLY',
    'Yearly Plan',
    'Best value - Full year access with maximum benefits',
    365,
    199,
    'USD',
    15,
    30,
    3,
    TRUE,
    TRUE,
    'Most Popular',
    'system',
    '2026-01-11 22:45:30'
);

