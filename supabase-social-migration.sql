-- ============================================================================
-- TempRun — migración para la pestaña Social (pista compartida + ranking)
-- ============================================================================
-- Hoy cada atleta solo puede leer su propia fila de "profiles" (RLS). Eso está
-- bien para datos privados (salud, pagos, plan de entrenamiento), pero la
-- pantalla Social necesita que todos los atletas vean nombre + avatar + puntos
-- + km semanales de TODOS los demás.
--
-- En vez de abrir "profiles" (que expondría salud, pagos, etc.), se crea una
-- tabla nueva y separada — "leaderboard" — que solo guarda lo público. Cada
-- atleta solo puede escribir SU PROPIA fila (los datos los calcula y sube su
-- propio navegador cada pocos segundos); todos pueden LEER todas las filas.
--
-- Corré este script completo en Supabase → SQL Editor → New query → Run.
-- Es seguro volver a correrlo si algo falla a mitad de camino.
-- ============================================================================

create table if not exists public.leaderboard (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_builder jsonb not null default '{}'::jsonb,
  points integer not null default 0,
  weekly_km numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

-- cualquier usuario logueado (atleta o coach) puede leer el ranking completo.
drop policy if exists "leaderboard select all" on public.leaderboard;
create policy "leaderboard select all"
  on public.leaderboard for select
  using (auth.uid() is not null);

-- cada usuario solo puede crear/actualizar SU PROPIA fila.
drop policy if exists "leaderboard insert own" on public.leaderboard;
create policy "leaderboard insert own"
  on public.leaderboard for insert
  with check (auth.uid() = id);

drop policy if exists "leaderboard update own" on public.leaderboard;
create policy "leaderboard update own"
  on public.leaderboard for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- mantiene "updated_at" al día en cada escritura, sin que la app tenga que
-- mandarlo manualmente.
create or replace function public.set_leaderboard_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leaderboard_updated_at on public.leaderboard;
create trigger trg_leaderboard_updated_at
  before update on public.leaderboard
  for each row execute function public.set_leaderboard_updated_at();

-- ============================================================================
-- Listo. Después de correr esto, cada atleta que entre a la app (o abra la
-- pestaña Social) va a publicar su fila automáticamente — no hace falta que
-- carguen nada a mano. La pista y el ranking semanal van a empezar a mostrar
-- a todo el club apenas cada uno haya entrado una vez con la app actualizada.
-- ============================================================================
