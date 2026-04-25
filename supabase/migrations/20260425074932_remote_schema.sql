drop extension if exists "pg_net";

drop policy "Allow anonymous insert" on "public"."orders";


  create policy "Allow insert for customers"
  on "public"."orders"
  as permissive
  for insert
  to public
with check (true);



