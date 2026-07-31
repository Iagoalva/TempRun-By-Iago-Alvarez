-- ============================================================================
-- TempRun — Setup de seguridad en Supabase
-- Corré esto UNA SOLA VEZ en tu proyecto: Dashboard de Supabase > SQL Editor >
-- New query > pegá todo este archivo > Run.
--
-- Reemplaza la tabla "accounts" (acceso abierto a cualquiera con la clave
-- pública) por una tabla "profiles" protegida con Row Level Security real:
-- cada atleta solo puede leer/escribir su propia fila, el coach puede
-- leer/escribir todas. Las contraseñas ya NO viven acá — las maneja
-- Supabase Auth (hasheadas del lado del servidor).
-- ============================================================================

-- 1) Tabla de perfiles, uno por usuario de Supabase Auth.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'athlete', -- 'athlete' | 'coach'
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 2) Función que determina si el usuario que hace el pedido es el coach.
--    SECURITY DEFINER + search_path fijo para que sea segura de usar dentro
--    de las policies sin caer en un loop de evaluación recursiva de RLS.
create or replace function public.is_coach()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'coach'
  );
$$;

-- 3) Trigger: el rol se asigna del lado del servidor según el email, nunca
--    lo decide el cliente. Cambiá 'coach@temprun.club' acá si tu email de
--    coach es otro.
create or replace function public.assign_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.email = 'coach@temprun.club' then
    NEW.role := 'coach';
  else
    NEW.role := 'athlete';
  end if;
  return NEW;
end;
$$;

drop trigger if exists set_profile_role on public.profiles;
create trigger set_profile_role
  before insert or update on public.profiles
  for each row execute function public.assign_profile_role();

-- 4) Policies de acceso.
drop policy if exists "select own or coach" on public.profiles;
create policy "select own or coach" on public.profiles
  for select using (auth.uid() = id or public.is_coach());

drop policy if exists "insert own" on public.profiles;
create policy "insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "update own or coach" on public.profiles;
create policy "update own or coach" on public.profiles
  for update using (auth.uid() = id or public.is_coach())
  with check (auth.uid() = id or public.is_coach());

-- 5) (Opcional pero recomendado) Borrá la tabla vieja "accounts" — ya no la
--    usa la app y tenía la policy abierta que exponía contraseñas en texto
--    plano. Sacá el comentario de la siguiente línea para borrarla:
-- drop table if exists public.accounts;

-- ============================================================================
-- Después de correr este SQL, en el dashboard de Supabase:
--
-- 1. Authentication > Providers > Email > desactivá "Confirm email"
--    (así el signup deja logueado al toque, como hoy). Podés reactivarlo
--    más adelante si querés pedir confirmación por email antes de dejar
--    entrar a alguien nuevo.
--
-- 2. Creá tu cuenta de coach como cualquier atleta: abrí la app, "Crear
--    cuenta", usá exactamente el email coach@temprun.club (o el que hayas
--    puesto en el paso 3 de este SQL) y elegí una contraseña nueva vos
--    mismo. El trigger la va a marcar como coach automáticamente.
--
-- 3. Probá el flujo completo en dos navegadores/dispositivos distintos:
--    - Anotate un atleta nuevo en el dispositivo A.
--    - Entrá como coach en el dispositivo B y confirmá que lo ves en el
--      panel de atletas.
--    - Escribile un mensaje desde el coach y confirmá que le llega al
--      atleta (puede tardar hasta 8 segundos, el intervalo de sync).
-- ============================================================================
