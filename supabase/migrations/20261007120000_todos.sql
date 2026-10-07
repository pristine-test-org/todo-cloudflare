-- Tally keeps a single shared list with no sign-in, so the anon role may read and change every row.
-- Tighten these policies before putting anything private in the table.

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index todos_created_at_idx on public.todos (created_at desc);

alter table public.todos enable row level security;

grant select, insert, update, delete on public.todos to anon, authenticated;

create policy "Anyone can read todos" on public.todos
  for select to anon, authenticated using (true);

create policy "Anyone can add todos" on public.todos
  for insert to anon, authenticated with check (true);

create policy "Anyone can update todos" on public.todos
  for update to anon, authenticated using (true) with check (true);

create policy "Anyone can delete todos" on public.todos
  for delete to anon, authenticated using (true);
