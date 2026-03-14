-- Budget transactions table (separate from debt account transactions)
create table if not exists public.budget_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.budget_categories(id) on delete set null,
  amount numeric(10,2) not null check (amount <> 0),
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_budget_txn_user_date
  on public.budget_transactions (user_id, transaction_date desc);

alter table public.budget_transactions enable row level security;

drop policy if exists "budget_transactions select own" on public.budget_transactions;
drop policy if exists "budget_transactions insert own" on public.budget_transactions;
drop policy if exists "budget_transactions delete own" on public.budget_transactions;

create policy "budget_transactions select own"
on public.budget_transactions
for select
to authenticated
using (auth.uid() = user_id);

create policy "budget_transactions insert own"
on public.budget_transactions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "budget_transactions delete own"
on public.budget_transactions
for delete
to authenticated
using (auth.uid() = user_id);
