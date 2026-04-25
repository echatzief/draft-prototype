drop policy "Allow insert for customers" on "public"."orders";


  create policy "Allow all inserts"
  on "public"."orders"
  as permissive
  for insert
  to public
with check (true);



