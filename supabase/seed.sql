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
