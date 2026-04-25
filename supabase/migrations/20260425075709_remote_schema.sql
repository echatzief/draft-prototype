drop policy "Allow all inserts" on "public"."orders";


  create policy "orders_insert"
  on "public"."orders"
  as permissive
  for insert
  to anon, authenticated
with check (true);



