-- Adventur Hoteles: roles administrativos y buckets esperados
-- Ejecutar desde Supabase SQL Editor con permisos de owner.

alter table public.usuarios
  drop constraint if exists usuarios_rol_check;

alter table public.usuarios
  add constraint usuarios_rol_check
  check (rol in ('admin', 'colaborador', 'viewer'));

create index if not exists idx_usuarios_rol on public.usuarios(rol);

-- Buckets publicos esperados por la app. No falla si ya existen.
insert into storage.buckets (id, name, public)
values
  ('imagenes', 'imagenes', true),
  ('hoteles', 'hoteles', true),
  ('avatares', 'avatares', true)
on conflict (id) do update
set public = excluded.public;

-- Politicas defensivas para Storage.
-- Ajusta los nombres si ya tienes politicas equivalentes.
drop policy if exists "Lectura publica imagenes Adventur" on storage.objects;
create policy "Lectura publica imagenes Adventur"
on storage.objects for select
using (bucket_id in ('imagenes', 'hoteles', 'avatares'));

drop policy if exists "Carga autenticada imagenes Adventur" on storage.objects;
create policy "Carga autenticada imagenes Adventur"
on storage.objects for insert
to authenticated
with check (bucket_id in ('imagenes', 'hoteles', 'avatares'));

drop policy if exists "Actualizacion admin imagenes Adventur" on storage.objects;
create policy "Actualizacion admin imagenes Adventur"
on storage.objects for update
to authenticated
using (
  bucket_id in ('imagenes', 'hoteles', 'avatares')
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol in ('admin', 'colaborador')
  )
)
with check (
  bucket_id in ('imagenes', 'hoteles', 'avatares')
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol in ('admin', 'colaborador')
  )
);

drop policy if exists "Eliminacion admin imagenes Adventur" on storage.objects;
create policy "Eliminacion admin imagenes Adventur"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('imagenes', 'hoteles', 'avatares')
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol = 'admin'
  )
);
