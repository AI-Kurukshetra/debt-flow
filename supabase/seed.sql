insert into public.loan_servicers (
  name,
  servicer_type,
  website_url,
  phone,
  api_supported,
  is_active
) values
  (
    'MOHELA',
    'federal',
    'https://www.mohela.com',
    '888-866-4352',
    false,
    true
  ),
  (
    'Nelnet',
    'federal',
    'https://nelnet.studentaid.gov',
    '888-486-4722',
    false,
    true
  ),
  (
    'Sallie Mae',
    'private',
    'https://www.salliemae.com',
    '800-472-5543',
    false,
    true
  ),
  (
    'SoFi',
    'personal',
    'https://www.sofi.com',
    '855-456-7634',
    false,
    true
  );

insert into public.forgiveness_programs (
  program_code,
  name,
  description,
  forgiveness_year,
  eligible_loan_types,
  eligible_plans,
  employment_required,
  payment_count_req,
  info_url,
  is_active
) values
  (
    'PSLF',
    'Public Service Loan Forgiveness',
    'Forgiveness for qualifying federal loans after 120 qualifying payments while working for an eligible employer.',
    10,
    array['Direct Subsidized', 'Direct Unsubsidized', 'Direct PLUS', 'Direct Consolidation'],
    array['IBR', 'PAYE', 'SAVE', 'ICR', 'Standard'],
    true,
    120,
    'https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service',
    true
  ),
  (
    'IDR_20',
    'Income-Driven Repayment (20-Year)',
    'Income-driven plans that may forgive the remaining balance after 20 years of qualifying payments.',
    20,
    array['Direct Subsidized', 'Direct Unsubsidized', 'Direct PLUS', 'Direct Consolidation'],
    array['PAYE', 'SAVE', 'IBR'],
    false,
    240,
    'https://studentaid.gov/manage-loans/repayment/plans/income-driven',
    true
  ),
  (
    'IDR_25',
    'Income-Driven Repayment (25-Year)',
    'Income-driven plans that may forgive the remaining balance after 25 years of qualifying payments.',
    25,
    array['Direct Subsidized', 'Direct Unsubsidized', 'Direct PLUS', 'Direct Consolidation'],
    array['ICR', 'IBR'],
    false,
    300,
    'https://studentaid.gov/manage-loans/repayment/plans/income-driven',
    true
  ),
  (
    'TEPSLF',
    'Temporary Expanded PSLF',
    'Expanded relief for borrowers who were on the wrong repayment plan but otherwise met PSLF-style requirements.',
    10,
    array['Direct Subsidized', 'Direct Unsubsidized', 'Direct PLUS', 'Direct Consolidation'],
    array['Graduated', 'Extended', 'Standard'],
    true,
    120,
    'https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service/questions',
    true
  ),
  (
    'TEACH',
    'TEACH Grant / Teacher Forgiveness',
    'Teacher-focused relief paths for eligible education professionals meeting service commitments.',
    5,
    array['Direct Subsidized', 'Direct Unsubsidized'],
    array['Standard', 'IBR', 'PAYE', 'SAVE'],
    true,
    null,
    'https://studentaid.gov/understand-aid/types/grants/teach',
    true
  );

insert into public.educational_content (
  title,
  slug,
  content_type,
  category,
  summary,
  body,
  reading_time_min,
  tags,
  is_published,
  published_at
) values
  (
    'Snowball vs Avalanche: Choosing a Debt Payoff Strategy',
    'snowball-vs-avalanche',
    'article',
    'budgeting',
    'A practical comparison of the two most common debt payoff methods and when each makes sense.',
    'The snowball method prioritizes motivation by knocking out the smallest balance first. The avalanche method prioritizes mathematics by attacking the highest interest rate first. DebtFlow supports both so borrowers can compare payoff speed, total interest, and motivation tradeoffs before committing.',
    6,
    array['debt payoff', 'snowball', 'avalanche'],
    true,
    now()
  ),
  (
    'Understanding PSLF Eligibility',
    'understanding-pslf-eligibility',
    'guide',
    'forgiveness',
    'Key rules for Public Service Loan Forgiveness, including qualifying employers, loans, and payments.',
    'PSLF requires qualifying employment, eligible Direct Loans, and 120 qualifying monthly payments. Keeping employer certification current and choosing the right repayment plan can reduce rework later.',
    8,
    array['pslf', 'student loans', 'forgiveness'],
    true,
    now()
  ),
  (
    'Student Loan Interest Deduction Basics',
    'student-loan-interest-deduction-basics',
    'article',
    'taxes',
    'A quick primer on how interest deductions can affect annual repayment planning.',
    'Borrowers may be able to deduct a portion of qualified student loan interest depending on filing status and income. Tracking annual interest and AGI helps estimate the real cost of a repayment strategy.',
    5,
    array['taxes', 'interest deduction', 'student loans'],
    true,
    now()
  );

-- Dev-only custom auth fixtures
-- username/email/password pairs:
--   rajiv_demo / rajiv_demo@debtflow.dev / DevPass123!
--   maya_demo / maya_demo@debtflow.dev / DevPass123!
insert into public.users (
  id,
  username,
  email,
  password_hash,
  full_name,
  employment_type,
  annual_income,
  family_size,
  is_active,
  is_verified,
  timezone,
  onboarding_step,
  last_login_at
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'rajiv_demo',
    'rajiv_demo@debtflow.dev',
    crypt('DevPass123!', gen_salt('bf', 10)),
    'Rajiv Demo',
    'employed',
    98000.00,
    2,
    true,
    true,
    'America/New_York',
    5,
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'maya_demo',
    'maya_demo@debtflow.dev',
    crypt('DevPass123!', gen_salt('bf', 10)),
    'Maya Demo',
    'self_employed',
    72000.00,
    1,
    true,
    true,
    'America/Chicago',
    4,
    now()
  );

insert into public.debt_accounts (
  id,
  user_id,
  servicer_id,
  account_name,
  account_number_last4,
  debt_type,
  loan_type,
  original_balance,
  current_balance,
  interest_rate,
  rate_type,
  minimum_payment,
  payment_due_day,
  repayment_plan,
  loan_term_months,
  start_date,
  payoff_date_est,
  is_pslf_eligible,
  sync_status,
  notes
) values
  (
    '31111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.loan_servicers where name = 'MOHELA' limit 1),
    'Graduate Direct Loan',
    '4821',
    'student_federal',
    'Direct Unsubsidized',
    86500.00,
    70240.11,
    0.0640,
    'fixed',
    525.00,
    12,
    'SAVE',
    240,
    '2018-08-15',
    '2036-04-12',
    true,
    'manual',
    'Primary federal loan for forgiveness modeling.'
  ),
  (
    '31111111-1111-4111-8111-111111111112',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.loan_servicers where name = 'Sallie Mae' limit 1),
    'Private Refinance Loan',
    '7719',
    'student_private',
    'Refinanced Student Loan',
    24000.00,
    18950.00,
    0.0710,
    'fixed',
    315.00,
    18,
    'STANDARD',
    120,
    '2021-05-01',
    '2029-10-18',
    false,
    'manual',
    'Private loan used for refinance comparisons.'
  ),
  (
    '31111111-1111-4111-8111-111111111113',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.loan_servicers where name = 'SoFi' limit 1),
    'Rewards Credit Card',
    '1188',
    'credit_card',
    null,
    11500.00,
    6820.45,
    0.2199,
    'variable',
    210.00,
    7,
    null,
    null,
    '2023-02-02',
    '2028-03-07',
    false,
    'manual',
    'High-interest account for avalanche comparisons.'
  ),
  (
    '32222222-2222-4222-8222-222222222221',
    '22222222-2222-4222-8222-222222222222',
    (select id from public.loan_servicers where name = 'Nelnet' limit 1),
    'Undergrad Federal Loan',
    '6721',
    'student_federal',
    'Direct Subsidized',
    18500.00,
    14280.72,
    0.0480,
    'fixed',
    180.00,
    10,
    'IBR',
    180,
    '2019-09-01',
    '2033-01-10',
    true,
    'manual',
    'Secondary user baseline debt account.'
  ),
  (
    '32222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    (select id from public.loan_servicers where name = 'SoFi' limit 1),
    'Startup Equipment Loan',
    '9014',
    'personal',
    null,
    9800.00,
    6150.00,
    0.0925,
    'fixed',
    240.00,
    21,
    'STANDARD',
    48,
    '2024-01-14',
    '2027-12-21',
    false,
    'manual',
    'Used to validate mixed debt types.'
  );

insert into public.transactions (
  user_id,
  account_id,
  transaction_date,
  amount,
  principal_applied,
  interest_applied,
  transaction_type,
  payment_method,
  balance_after,
  is_autopay,
  notes
) values
  (
    '11111111-1111-4111-8111-111111111111',
    '31111111-1111-4111-8111-111111111111',
    current_date - 60,
    525.00,
    161.00,
    364.00,
    'payment',
    'autopay',
    70895.11,
    true,
    'Standard monthly payment.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '31111111-1111-4111-8111-111111111113',
    current_date - 35,
    460.00,
    340.00,
    120.00,
    'extra_payment',
    'bank_transfer',
    7190.45,
    false,
    'Extra avalanche payment.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '32222222-2222-4222-8222-222222222221',
    current_date - 28,
    180.00,
    109.00,
    71.00,
    'payment',
    'bank_transfer',
    14280.72,
    false,
    'Secondary user monthly payment.'
  );

insert into public.payment_strategies (
  id,
  user_id,
  name,
  strategy_type,
  monthly_budget,
  extra_payment_amount,
  priority_account_ids,
  is_active,
  projected_payoff_date,
  projected_interest_saved,
  calculation_snapshot,
  last_calculated_at
) values
  (
    '41111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    'Debt Avalanche 2026',
    'avalanche',
    1550.00,
    350.00,
    array['31111111-1111-4111-8111-111111111113'::uuid, '31111111-1111-4111-8111-111111111112'::uuid],
    true,
    '2030-06-15',
    12840.55,
    '{"focus":"highest_interest","confidence":"seed"}',
    now()
  ),
  (
    '42222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    'Balanced Paydown',
    'hybrid',
    620.00,
    90.00,
    array['32222222-2222-4222-8222-222222222222'::uuid],
    true,
    '2028-11-01',
    1740.00,
    '{"focus":"stability"}',
    now()
  );

insert into public.payment_schedules (
  user_id,
  account_id,
  strategy_id,
  due_date,
  amount,
  payment_type,
  status
) values
  (
    '11111111-1111-4111-8111-111111111111',
    '31111111-1111-4111-8111-111111111111',
    '41111111-1111-4111-8111-111111111111',
    current_date + 7,
    525.00,
    'minimum',
    'pending'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '31111111-1111-4111-8111-111111111113',
    '41111111-1111-4111-8111-111111111111',
    current_date + 10,
    460.00,
    'extra',
    'pending'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '32222222-2222-4222-8222-222222222221',
    '42222222-2222-4222-8222-222222222222',
    current_date + 12,
    180.00,
    'minimum',
    'pending'
  );

insert into public.user_goals (
  user_id,
  account_id,
  goal_type,
  title,
  description,
  target_amount,
  target_date,
  current_progress,
  status
) values
  (
    '11111111-1111-4111-8111-111111111111',
    '31111111-1111-4111-8111-111111111113',
    'balance_target',
    'Bring credit card below $5k',
    'Backend fixture for goal tracking.',
    5000.00,
    current_date + 120,
    6820.45,
    'active'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    null,
    'emergency_fund',
    'Build a 3-month cushion',
    'Used to test a non-account-linked goal.',
    9000.00,
    current_date + 240,
    3200.00,
    'active'
  );

insert into public.budget_categories (
  user_id,
  category_name,
  category_type,
  budgeted_amount,
  actual_amount,
  budget_month,
  is_recurring,
  notes
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'Monthly Income',
    'income',
    6200.00,
    6200.00,
    date_trunc('month', current_date)::date,
    true,
    'Primary borrower paycheck.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'Debt Payments',
    'debt_payment',
    1550.00,
    1420.00,
    date_trunc('month', current_date)::date,
    true,
    'Supports active avalanche strategy.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Savings',
    'savings',
    400.00,
    275.00,
    date_trunc('month', current_date)::date,
    true,
    'Emergency fund contribution.'
  );

insert into public.user_forgiveness_tracking (
  user_id,
  program_id,
  account_id,
  qualifying_payments,
  payments_remaining,
  employer_name,
  estimated_forgiveness_date,
  estimated_forgiveness_amount,
  status,
  notes
) values
  (
    '11111111-1111-4111-8111-111111111111',
    (select id from public.forgiveness_programs where program_code = 'PSLF' limit 1),
    '31111111-1111-4111-8111-111111111111',
    46,
    74,
    'City Health Network',
    current_date + 900,
    41200.00,
    'tracking',
    'Primary fixture for forgiveness progress.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    (select id from public.forgiveness_programs where program_code = 'IDR_20' limit 1),
    '32222222-2222-4222-8222-222222222221',
    18,
    222,
    null,
    current_date + 2400,
    9800.00,
    'tracking',
    'Secondary fixture for long-horizon forgiveness.'
  );

insert into public.credit_scores (
  user_id,
  score,
  bureau,
  score_model,
  factors,
  source,
  recorded_at
) values
  (
    '11111111-1111-4111-8111-111111111111',
    712,
    'experian',
    'FICO8',
    '["utilization improving","student loan age"]'::jsonb,
    'manual',
    now() - interval '45 days'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    726,
    'experian',
    'FICO8',
    '["card payoff momentum","on-time payments"]'::jsonb,
    'manual',
    now()
  );

insert into public.refinancing_offers (
  user_id,
  servicer_id,
  lender_name,
  offered_rate,
  rate_type,
  loan_term_months,
  estimated_payment,
  total_interest_cost,
  origination_fee,
  min_credit_score,
  pre_qualification,
  offer_expires_at,
  apply_url
) values
  (
    '11111111-1111-4111-8111-111111111111',
    (select id from public.loan_servicers where name = 'SoFi' limit 1),
    'SoFi Refi',
    0.0575,
    'fixed',
    120,
    765.00,
    9320.00,
    0.00,
    700,
    true,
    now() + interval '21 days',
    'https://www.sofi.com'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    (select id from public.loan_servicers where name = 'Sallie Mae' limit 1),
    'Sallie Mae Refi',
    0.0635,
    'fixed',
    180,
    584.00,
    14320.00,
    95.00,
    690,
    true,
    now() + interval '14 days',
    'https://www.salliemae.com'
  );

insert into public.tax_optimizations (
  user_id,
  tax_year,
  total_interest_paid,
  deductible_interest,
  estimated_tax_savings,
  filing_status,
  adjusted_gross_income,
  idr_taxable_forgiveness,
  pslf_tax_free_forgiveness,
  notes
) values
  (
    '11111111-1111-4111-8111-111111111111',
    extract(year from current_date)::smallint - 1,
    2480.00,
    2480.00,
    545.00,
    'single',
    94000.00,
    12000.00,
    41200.00,
    'Dev fixture for annual tax analysis.'
  );

insert into public.notifications (
  user_id,
  notification_type,
  title,
  body,
  channel,
  is_read,
  action_url,
  metadata
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'payment_due',
    'Student loan payment due soon',
    'Your Graduate Direct Loan payment is due in 7 days.',
    'in_app',
    false,
    '/dashboard',
    '{"account_id":"31111111-1111-4111-8111-111111111111"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'refinance_alert',
    'A lower refinance rate is available',
    'A new 5.75% offer may improve your payoff timeline.',
    'email',
    false,
    '/refinancing',
    '{"offer_source":"SoFi Refi"}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'milestone',
    'Goal progress updated',
    'Your emergency fund goal is 35% complete.',
    'in_app',
    false,
    '/goals',
    '{"goal_type":"emergency_fund"}'::jsonb
  );

insert into public.projects (
  title,
  description,
  status,
  progress,
  owner_name,
  is_demo
) values
  (
    'Pitch Sprint',
    'Turn a rough idea into a launch-ready landing page with AI support.',
    'Building',
    68,
    'Starter Seed',
    true
  ),
  (
    'Feedback Radar',
    'Collect prioritized feature requests and ship in weekly cycles.',
    'Idea',
    24,
    'Starter Seed',
    true
  ),
  (
    'Demo Metrics',
    'Track onboarding and conversion signals from each session.',
    'Launched',
    91,
    'Starter Seed',
    true
  );

insert into public.project_updates (project_id, event)
select p.id, event.event
from public.projects p
cross join lateral (
  values
    (p.title || ' generated seed plan.'),
    (p.title || ' created by seed flow.'),
    (p.title || ' marked as public demo.')
) event(event)
where p.is_demo
;
