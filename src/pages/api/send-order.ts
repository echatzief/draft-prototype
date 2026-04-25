import { Resend } from "resend";
import { supabaseAdmin } from "../../integrations/supabase/client";

export const prerender = false;

export const POST = async ({ request }: { request: Request }) => {
  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY || "");

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
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const orderItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
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
      return Response.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    const itemsList = orderItems
      .map((item: any) => `${item.name} x${item.quantity} - €${item.price}`)
      .join("\n");

    try {
      await resend.emails.send({
        from: "Draft Prototype <no-reply@draft-prototype.gr>",
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
    } catch (e) {
      console.error("Email send error:", e);
    }

    try {
      await resend.emails.send({
        from: "Draft Prototype <no-reply@draft-prototype.gr>",
        to: import.meta.env.OWNER_EMAIL || "echatzief97@gmail.com",
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
    } catch (e) {
      console.error("Owner email send error:", e);
    }

    return Response.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Function error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
