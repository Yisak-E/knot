-- Knot: study-notes collections. Separate knot_ tables; does not touch other tables in the project.
create table public.knot_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.knot_subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  code text,
  description text,
  color text not null default '#0f766e',
  sort int not null default 100,
  created_at timestamptz not null default now()
);

create table public.knot_notes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.knot_subjects(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text,
  body_md text not null default '',
  tags text[] not null default '{}',
  sort int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, slug)
);
create index knot_notes_subject_idx on public.knot_notes(subject_id);

create or replace function public.knot_is_editor()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.knot_editors e where e.user_id = (select auth.uid())) $$;
revoke execute on function public.knot_is_editor() from public;
grant execute on function public.knot_is_editor() to anon, authenticated;

create or replace function public.knot_touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;
create trigger knot_notes_touch before update on public.knot_notes
for each row execute function public.knot_touch_updated_at();

alter table public.knot_editors enable row level security;
alter table public.knot_subjects enable row level security;
alter table public.knot_notes enable row level security;

create policy "editors see own row" on public.knot_editors
  for select to authenticated using (user_id = (select auth.uid()));

create policy "anyone reads subjects" on public.knot_subjects for select to anon, authenticated using (true);
create policy "editors insert subjects" on public.knot_subjects for insert to authenticated with check ((select public.knot_is_editor()));
create policy "editors update subjects" on public.knot_subjects for update to authenticated using ((select public.knot_is_editor())) with check ((select public.knot_is_editor()));
create policy "editors delete subjects" on public.knot_subjects for delete to authenticated using ((select public.knot_is_editor()));

create policy "anyone reads notes" on public.knot_notes for select to anon, authenticated using (true);
create policy "editors insert notes" on public.knot_notes for insert to authenticated with check ((select public.knot_is_editor()));
create policy "editors update notes" on public.knot_notes for update to authenticated using ((select public.knot_is_editor())) with check ((select public.knot_is_editor()));
create policy "editors delete notes" on public.knot_notes for delete to authenticated using ((select public.knot_is_editor()));

-- Grant edit rights to an account (run once per editor):
-- insert into public.knot_editors (user_id) select id from auth.users where email = 'you@example.com';
