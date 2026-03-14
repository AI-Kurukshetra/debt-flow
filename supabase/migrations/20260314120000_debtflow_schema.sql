create extension if not exists "pg_stat_statements";

alter table public.profiles
  add column if not exists username varchar(50),
  add column if not exists email varchar(255),
  add column if not exists phone varchar(20),
  add column if not exists date_of_birth date,
  add column if not exists employment_type varchar(30),
  add column if not exists annual_income numeric(14,2),
  add column if not exists family_size smallint,
  add column if not exists is_active boolean not null default true,
  add column if not exists is_verified boolean not null default false,
  add column if not exists avatar_url text,
  add column if not exists timezone varchar(60),
  add column if not exists onboarding_step smallint not null default 0,
  add column if not exists last_login_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_employment_type_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_employment_type_check
      check (employment_type in ('employed', 'self_employed', 'unemployed', 'student'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_family_size_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_family_size_check
      check (family_size is null or family_size >= 1);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_onboarding_step_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_onboarding_step_check
      check (onboarding_step between 0 and 5);
  end if;
end $$;

update public.profiles p
set
  email = lower(coalesce(p.email, au.email)),
  is_verified = p.is_verified or au.email_confirmed_at is not null,
  avatar_url = coalesce(p.avatar_url, au.raw_user_meta_data->>'avatar_url')
from auth.users au
where au.id = p.id;

create unique index if not exists idx_profiles_email
  on public.profiles (lower(email))
  where email is not null;

create unique index if not exists idx_profiles_username
  on public.profiles (lower(username))
  where username is not null;

create table if not exists public.loan_servicers (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null,
  servicer_type varchar(30) not null
    check (servicer_type in ('federal', 'private', 'credit_card', 'mortgage', 'personal', 'other')),
  website_url text,
  phone varchar(20),
  api_supported boolean not null default false,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.debt_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  servicer_id uuid references public.loan_servicers(id) on delete set null,
  account_name varchar(150) not null,
  account_number_last4 char(4),
  debt_type varchar(30) not null
    check (debt_type in ('student_federal', 'student_private', 'credit_card', 'mortgage', 'personal', 'auto', 'other')),
  loan_type varchar(50),
  original_balance numeric(14,2) not null,
  current_balance numeric(14,2) not null,
  interest_rate numeric(6,4) not null check (interest_rate >= 0),
  rate_type varchar(10) not null check (rate_type in ('fixed', 'variable')),
  minimum_payment numeric(10,2) not null default 0,
  payment_due_day smallint check (payment_due_day between 1 and 31),
  repayment_plan varchar(50),
  loan_term_months smallint,
  start_date date,
  payoff_date_est date,
  is_in_deferment boolean not null default false,
  is_in_forbearance boolean not null default false,
  is_pslf_eligible boolean,
  is_active boolean not null default true,
  sync_status varchar(20) not null default 'manual'
    check (sync_status in ('manual', 'synced', 'sync_failed', 'pending')),
  last_synced_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_debt_accounts_user_id
  on public.debt_accounts (user_id);

create index if not exists idx_debt_accounts_debt_type
  on public.debt_accounts (user_id, debt_type);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.debt_accounts(id) on delete cascade,
  transaction_date date not null,
  amount numeric(10,2) not null check (amount <> 0),
  principal_applied numeric(10,2),
  interest_applied numeric(10,2),
  fees_applied numeric(10,2),
  transaction_type varchar(30) not null
    check (transaction_type in ('payment', 'extra_payment', 'refund', 'adjustment', 'fee', 'disbursement')),
  payment_method varchar(30),
  reference_number varchar(100),
  balance_after numeric(14,2),
  is_autopay boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_txn_account_id
  on public.transactions (account_id, transaction_date desc);

create index if not exists idx_txn_user_id
  on public.transactions (user_id, transaction_date desc);

create table if not exists public.payment_strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name varchar(100) not null,
  strategy_type varchar(20) not null
    check (strategy_type in ('snowball', 'avalanche', 'custom', 'hybrid')),
  monthly_budget numeric(10,2) not null check (monthly_budget > 0),
  extra_payment_amount numeric(10,2) default 0,
  priority_account_ids uuid[],
  is_active boolean not null default false,
  projected_payoff_date date,
  projected_interest_saved numeric(12,2),
  calculation_snapshot jsonb,
  last_calculated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_strategy_active_user
  on public.payment_strategies (user_id)
  where is_active = true;

create table if not exists public.payment_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.debt_accounts(id) on delete cascade,
  strategy_id uuid references public.payment_strategies(id) on delete set null,
  due_date date not null,
  amount numeric(10,2) not null check (amount > 0),
  payment_type varchar(20) not null
    check (payment_type in ('minimum', 'extra', 'full_payoff')),
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'paid', 'skipped', 'failed')),
  paid_at timestamptz,
  transaction_id uuid references public.transactions(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sched_user_due
  on public.payment_schedules (user_id, due_date);

create index if not exists idx_sched_status
  on public.payment_schedules (status, due_date)
  where status = 'pending';

create table if not exists public.forgiveness_programs (
  id uuid primary key default gen_random_uuid(),
  program_code varchar(20) not null unique,
  name varchar(150) not null,
  description text,
  forgiveness_year smallint,
  eligible_loan_types text[],
  eligible_plans text[],
  employment_required boolean not null default false,
  payment_count_req smallint,
  info_url text,
  is_active boolean not null default true
);

create table if not exists public.user_forgiveness_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  program_id uuid not null references public.forgiveness_programs(id) on delete restrict,
  account_id uuid references public.debt_accounts(id) on delete set null,
  qualifying_payments smallint not null default 0,
  payments_remaining smallint,
  employer_name varchar(150),
  employer_ein varchar(20),
  ecf_submission_date date,
  estimated_forgiveness_date date,
  estimated_forgiveness_amount numeric(14,2),
  status varchar(20) not null default 'tracking'
    check (status in ('tracking', 'eligible', 'applied', 'approved', 'not_eligible')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_id, account_id)
);

create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.debt_accounts(id) on delete set null,
  goal_type varchar(30) not null
    check (goal_type in ('debt_free', 'balance_target', 'emergency_fund', 'refinance', 'milestone')),
  title varchar(150) not null,
  description text,
  target_amount numeric(12,2),
  target_date date,
  current_progress numeric(12,2) not null default 0,
  status varchar(20) not null default 'active'
    check (status in ('active', 'completed', 'abandoned')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_name varchar(80) not null,
  category_type varchar(20) not null
    check (category_type in ('income', 'fixed_expense', 'variable_expense', 'debt_payment', 'savings')),
  budgeted_amount numeric(10,2) not null,
  actual_amount numeric(10,2),
  budget_month date not null,
  is_recurring boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_budget_user_month
  on public.budget_categories (user_id, budget_month);

create table if not exists public.credit_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score smallint not null check (score between 300 and 850),
  bureau varchar(30) not null check (bureau in ('equifax', 'experian', 'transunion')),
  score_model varchar(30),
  factors jsonb,
  source varchar(30) not null default 'manual',
  recorded_at timestamptz not null default now()
);

create index if not exists idx_credit_user_date
  on public.credit_scores (user_id, recorded_at desc);

create table if not exists public.refinancing_offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  servicer_id uuid references public.loan_servicers(id) on delete set null,
  lender_name varchar(150) not null,
  offered_rate numeric(6,4) not null,
  rate_type varchar(10) not null check (rate_type in ('fixed', 'variable')),
  loan_term_months smallint not null,
  estimated_payment numeric(10,2),
  total_interest_cost numeric(12,2),
  origination_fee numeric(8,2) default 0,
  min_credit_score smallint,
  pre_qualification boolean not null default true,
  offer_expires_at timestamptz,
  apply_url text,
  fetched_at timestamptz not null default now()
);

create index if not exists idx_refi_user_rate
  on public.refinancing_offers (user_id, offered_rate);

create table if not exists public.tax_optimizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tax_year smallint not null,
  total_interest_paid numeric(10,2),
  deductible_interest numeric(10,2),
  estimated_tax_savings numeric(10,2),
  filing_status varchar(30)
    check (filing_status in ('single', 'married_joint', 'married_sep', 'head_of_household')),
  adjusted_gross_income numeric(12,2),
  idr_taxable_forgiveness numeric(12,2),
  pslf_tax_free_forgiveness numeric(12,2),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, tax_year)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_type varchar(50) not null
    check (notification_type in ('payment_due', 'payment_confirmed', 'rate_change', 'milestone', 'forgiveness_update', 'refinance_alert', 'system')),
  title varchar(150) not null,
  body text not null,
  channel varchar(20) not null check (channel in ('in_app', 'email', 'push')),
  is_read boolean not null default false,
  read_at timestamptz,
  action_url text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_notif_user_unread
  on public.notifications (user_id, created_at desc)
  where is_read = false;

create table if not exists public.educational_content (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  slug varchar(200) not null unique,
  content_type varchar(20) not null
    check (content_type in ('article', 'video', 'guide', 'calculator_guide')),
  category varchar(50) not null
    check (category in ('student_loans', 'credit_cards', 'budgeting', 'forgiveness', 'investing', 'taxes')),
  summary text,
  body text,
  video_url text,
  reading_time_min smallint,
  tags text[],
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_edu_category
  on public.educational_content (category, is_published);

create index if not exists idx_edu_tags
  on public.educational_content using gin (tags);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'debt_accounts',
    'payment_strategies',
    'user_forgiveness_tracking',
    'user_goals',
    'educational_content'
  ] loop
    if not exists (
      select 1
      from pg_trigger
      where tgname = 'trg_' || table_name || '_updated_at'
        and tgrelid = to_regclass('public.' || table_name)
    ) then
      execute format(
        'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
        'trg_' || table_name || '_updated_at',
        table_name
      );
    end if;
  end loop;
end $$;

drop policy if exists "profiles select authenticated" on public.profiles;
drop policy if exists "profiles upsert own" on public.profiles;
drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;

create policy "profiles select own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles insert own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles update own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

alter table public.loan_servicers enable row level security;
alter table public.debt_accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.payment_strategies enable row level security;
alter table public.payment_schedules enable row level security;
alter table public.forgiveness_programs enable row level security;
alter table public.user_forgiveness_tracking enable row level security;
alter table public.user_goals enable row level security;
alter table public.budget_categories enable row level security;
alter table public.credit_scores enable row level security;
alter table public.refinancing_offers enable row level security;
alter table public.tax_optimizations enable row level security;
alter table public.notifications enable row level security;
alter table public.educational_content enable row level security;

drop policy if exists "loan_servicers public read" on public.loan_servicers;
create policy "loan_servicers public read"
on public.loan_servicers
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "forgiveness_programs public read" on public.forgiveness_programs;
create policy "forgiveness_programs public read"
on public.forgiveness_programs
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "educational_content public read" on public.educational_content;
create policy "educational_content public read"
on public.educational_content
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "debt_accounts select own" on public.debt_accounts;
drop policy if exists "debt_accounts insert own" on public.debt_accounts;
drop policy if exists "debt_accounts update own" on public.debt_accounts;
drop policy if exists "debt_accounts delete own" on public.debt_accounts;
create policy "debt_accounts select own"
on public.debt_accounts
for select
to authenticated
using (auth.uid() = user_id);
create policy "debt_accounts insert own"
on public.debt_accounts
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "debt_accounts update own"
on public.debt_accounts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "debt_accounts delete own"
on public.debt_accounts
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "transactions select own" on public.transactions;
drop policy if exists "transactions insert own" on public.transactions;
create policy "transactions select own"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);
create policy "transactions insert own"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "payment_strategies select own" on public.payment_strategies;
drop policy if exists "payment_strategies insert own" on public.payment_strategies;
drop policy if exists "payment_strategies update own" on public.payment_strategies;
drop policy if exists "payment_strategies delete own" on public.payment_strategies;
create policy "payment_strategies select own"
on public.payment_strategies
for select
to authenticated
using (auth.uid() = user_id);
create policy "payment_strategies insert own"
on public.payment_strategies
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "payment_strategies update own"
on public.payment_strategies
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "payment_strategies delete own"
on public.payment_strategies
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "payment_schedules select own" on public.payment_schedules;
drop policy if exists "payment_schedules insert own" on public.payment_schedules;
drop policy if exists "payment_schedules update own" on public.payment_schedules;
drop policy if exists "payment_schedules delete own" on public.payment_schedules;
create policy "payment_schedules select own"
on public.payment_schedules
for select
to authenticated
using (auth.uid() = user_id);
create policy "payment_schedules insert own"
on public.payment_schedules
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "payment_schedules update own"
on public.payment_schedules
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "payment_schedules delete own"
on public.payment_schedules
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_forgiveness_tracking select own" on public.user_forgiveness_tracking;
drop policy if exists "user_forgiveness_tracking insert own" on public.user_forgiveness_tracking;
drop policy if exists "user_forgiveness_tracking update own" on public.user_forgiveness_tracking;
drop policy if exists "user_forgiveness_tracking delete own" on public.user_forgiveness_tracking;
create policy "user_forgiveness_tracking select own"
on public.user_forgiveness_tracking
for select
to authenticated
using (auth.uid() = user_id);
create policy "user_forgiveness_tracking insert own"
on public.user_forgiveness_tracking
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "user_forgiveness_tracking update own"
on public.user_forgiveness_tracking
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "user_forgiveness_tracking delete own"
on public.user_forgiveness_tracking
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_goals select own" on public.user_goals;
drop policy if exists "user_goals insert own" on public.user_goals;
drop policy if exists "user_goals update own" on public.user_goals;
drop policy if exists "user_goals delete own" on public.user_goals;
create policy "user_goals select own"
on public.user_goals
for select
to authenticated
using (auth.uid() = user_id);
create policy "user_goals insert own"
on public.user_goals
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "user_goals update own"
on public.user_goals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "user_goals delete own"
on public.user_goals
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "budget_categories select own" on public.budget_categories;
drop policy if exists "budget_categories insert own" on public.budget_categories;
drop policy if exists "budget_categories update own" on public.budget_categories;
drop policy if exists "budget_categories delete own" on public.budget_categories;
create policy "budget_categories select own"
on public.budget_categories
for select
to authenticated
using (auth.uid() = user_id);
create policy "budget_categories insert own"
on public.budget_categories
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "budget_categories update own"
on public.budget_categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "budget_categories delete own"
on public.budget_categories
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "credit_scores select own" on public.credit_scores;
drop policy if exists "credit_scores insert own" on public.credit_scores;
drop policy if exists "credit_scores update own" on public.credit_scores;
drop policy if exists "credit_scores delete own" on public.credit_scores;
create policy "credit_scores select own"
on public.credit_scores
for select
to authenticated
using (auth.uid() = user_id);
create policy "credit_scores insert own"
on public.credit_scores
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "credit_scores update own"
on public.credit_scores
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "credit_scores delete own"
on public.credit_scores
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "refinancing_offers select own" on public.refinancing_offers;
drop policy if exists "refinancing_offers insert own" on public.refinancing_offers;
drop policy if exists "refinancing_offers update own" on public.refinancing_offers;
drop policy if exists "refinancing_offers delete own" on public.refinancing_offers;
create policy "refinancing_offers select own"
on public.refinancing_offers
for select
to authenticated
using (auth.uid() = user_id);
create policy "refinancing_offers insert own"
on public.refinancing_offers
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "refinancing_offers update own"
on public.refinancing_offers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "refinancing_offers delete own"
on public.refinancing_offers
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tax_optimizations select own" on public.tax_optimizations;
drop policy if exists "tax_optimizations insert own" on public.tax_optimizations;
drop policy if exists "tax_optimizations update own" on public.tax_optimizations;
drop policy if exists "tax_optimizations delete own" on public.tax_optimizations;
create policy "tax_optimizations select own"
on public.tax_optimizations
for select
to authenticated
using (auth.uid() = user_id);
create policy "tax_optimizations insert own"
on public.tax_optimizations
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "tax_optimizations update own"
on public.tax_optimizations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "tax_optimizations delete own"
on public.tax_optimizations
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "notifications select own" on public.notifications;
drop policy if exists "notifications insert own" on public.notifications;
drop policy if exists "notifications update own" on public.notifications;
drop policy if exists "notifications delete own" on public.notifications;
create policy "notifications select own"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);
create policy "notifications insert own"
on public.notifications
for insert
to authenticated
with check (auth.uid() = user_id);
create policy "notifications update own"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "notifications delete own"
on public.notifications
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    username,
    avatar_url,
    is_verified,
    last_login_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Guest'),
    lower(new.email),
    nullif(lower(new.raw_user_meta_data->>'username'), ''),
    new.raw_user_meta_data->>'avatar_url',
    new.email_confirmed_at is not null,
    new.last_sign_in_at
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = coalesce(public.profiles.email, excluded.email),
    username = coalesce(public.profiles.username, excluded.username),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    is_verified = public.profiles.is_verified or excluded.is_verified,
    last_login_at = coalesce(excluded.last_login_at, public.profiles.last_login_at),
    updated_at = timezone('utc', now());

  return new;
end;
$$ language plpgsql security definer;
