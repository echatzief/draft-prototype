import { createClient } from "npm:@supabase/supabase-js";
const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
export async function onRequestPost(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      totalAmount,
      currency,
      items,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      notes,
    } = body;
    if (!customerName || !customerEmail || !items?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }
    const orderItems = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
    }));
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_postal_code: shippingPostalCode,
        shipping_country: shippingCountry,
        notes: notes || null,
        currency: currency || "EUR",
        total_amount: totalAmount,
        items: orderItems,
        status: "pending",
      })
      .select("id")
      .single();
    if (orderError) {
      console.error("Order insert error:", orderError);
      return new Response(
        JSON.stringify({
          error: "Failed to create order",
          details: orderError,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }
    if (Deno.env.get("RESEND_API_KEY")) {
      const itemsList = orderItems
        .map((item: any) => `${item.name} x${item.quantity} - €${item.price}`)
        .join("\n");
      await resend.emails.send({
        from: "Draft Prototype <onboarding@resend.dev>",
        to: customerEmail,
        subject: "Order Confirmed - Draft Prototype",
        html: `
          <h1>Thank you for your order, ${customerName}!</h1>
          <p>Your order #${order.id} has been received.</p>
          <h2>Order Details</h2>
          <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${itemsList}</pre>
          <p><strong>Total:</strong> €${totalAmount}</p>
          <h2>Shipping Address</h2>
          <p>${shippingAddress}<br>${shippingCity}, ${shippingPostalCode}<br>${shippingCountry}</p>
          <p>We'll notify you once your order ships.</p>
        `,
      });
      await resend.emails.send({
        from: "Draft Prototype <onboarding@resend.dev>",
        to: Deno.env.get("OWNER_EMAIL") || "echatzief97@gmail.com",
        subject: `New Order #${order.id} from ${customerName}`,
        html: `
          <h1>New Order Received</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <h2>Items</h2>
          <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${itemsList}</pre>
          <p><strong>Total:</strong> €${totalAmount}</p>
          <h2>Shipping</h2>
          <p>${shippingAddress}<br>${shippingCity}, ${shippingPostalCode}<br>${shippingCountry}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        `,
      });
    }
    return new Response(JSON.stringify({ success: true, orderId: order.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
export async function onRequestOptions(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
