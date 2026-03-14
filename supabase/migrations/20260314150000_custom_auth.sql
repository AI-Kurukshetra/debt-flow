create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username varchar(50) not null,
  email varchar(255) not null,
  password_hash text not null,
  full_name varchar(150),
  phone varchar(20),
  date_of_birth date,
  employment_type varchar(30)
    check (employment_type in ('employed', 'self_employed', 'unemployed', 'student')),
  annual_income numeric(14,2),
  family_size smallint
    check (family_size is null or family_size >= 1),
  is_active boolean not null default true,
  is_verified boolean not null default false,
  avatar_url text,
  timezone varchar(60),
  onboarding_step smallint not null default 0
    check (onboarding_step between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create unique index if not exists idx_users_email
  on public.users (lower(email));

create unique index if not exists idx_users_username
  on public.users (lower(username));

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_token text not null unique,
  device_info jsonb,
  ip_address inet,
  expires_at timestamptz not null,
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_user_id
  on public.user_sessions (user_id);

create index if not exists idx_sessions_token
  on public.user_sessions (session_token);

create table if not exists public.refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_id uuid references public.user_sessions(id) on delete cascade,
  token_hash text not null unique,
  family_id uuid not null,
  is_used boolean not null default false,
  expires_at timestamptz not null,
  issued_at timestamptz not null default now()
);

create index if not exists idx_rt_user_id
  on public.refresh_tokens (user_id);

create index if not exists idx_rt_family_id
  on public.refresh_tokens (family_id);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_users_updated_at'
      and tgrelid = to_regclass('public.users')
  ) then
    create trigger trg_users_updated_at
      before update on public.users
      for each row execute function public.set_updated_at();
  end if;
end $$;

create or replace function public.sync_user_to_profile()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    username,
    phone,
    date_of_birth,
    employment_type,
    annual_income,
    family_size,
    is_active,
    is_verified,
    avatar_url,
    timezone,
    onboarding_step,
    last_login_at,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.full_name,
    lower(new.email),
    lower(new.username),
    new.phone,
    new.date_of_birth,
    new.employment_type,
    new.annual_income,
    new.family_size,
    new.is_active,
    new.is_verified,
    new.avatar_url,
    new.timezone,
    new.onboarding_step,
    new.last_login_at,
    new.created_at,
    new.updated_at
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    username = excluded.username,
    phone = excluded.phone,
    date_of_birth = excluded.date_of_birth,
    employment_type = excluded.employment_type,
    annual_income = excluded.annual_income,
    family_size = excluded.family_size,
    is_active = excluded.is_active,
    is_verified = excluded.is_verified,
    avatar_url = excluded.avatar_url,
    timezone = excluded.timezone,
    onboarding_step = excluded.onboarding_step,
    last_login_at = excluded.last_login_at,
    updated_at = excluded.updated_at;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_user_to_profile on public.users;
create trigger trg_sync_user_to_profile
  after insert or update on public.users
  for each row execute function public.sync_user_to_profile();

create or replace function public.register_local_user(
  p_username varchar,
  p_email varchar,
  p_password text,
  p_full_name varchar default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_username varchar;
  v_email varchar;
begin
  v_username := lower(trim(p_username));
  v_email := lower(trim(p_email));

  if v_username is null or char_length(v_username) < 3 then
    raise exception 'Username must be at least 3 characters.';
  end if;

  if v_email is null or position('@' in v_email) = 0 then
    raise exception 'Provide a valid email address.';
  end if;

  if p_password is null or char_length(p_password) < 8 then
    raise exception 'Password must be at least 8 characters.';
  end if;

  insert into public.users (
    username,
    email,
    password_hash,
    full_name,
    is_verified
  )
  values (
    v_username,
    v_email,
    crypt(p_password, gen_salt('bf', 10)),
    nullif(trim(p_full_name), ''),
    true
  )
  returning id into v_user_id;

  return v_user_id;
end;
$$;

create or replace function public.authenticate_local_user(
  p_identifier varchar,
  p_password text
)
returns table (
  id uuid,
  username varchar,
  email varchar,
  full_name varchar,
  is_active boolean,
  is_verified boolean
)
language plpgsql
security definer
as $$
declare
  v_identifier varchar;
begin
  v_identifier := lower(trim(p_identifier));

  return query
  select
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.is_active,
    u.is_verified
  from public.users u
  where (
      lower(u.email) = v_identifier
      or lower(u.username) = v_identifier
    )
    and u.password_hash = crypt(p_password, u.password_hash)
    and u.is_active = true
  limit 1;
end;
$$;
