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

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 32px;">
        <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111;">Order Confirmed</h1>
        <p style="margin: 0 0 24px; color: #666;">Hi ${customerName}, thank you for your order!</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px;">
              <strong style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order #${order.id}</strong>
              <span style="float: right; font-size: 18px; font-weight: 600;">€${totalAmount}</span>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #333;">Items</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          ${orderItems
            .map(
              (item: any) => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; color: #666;">x${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">€${item.price}</td>
          </tr>
          `,
            )
            .join("")}
        </table>

        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #333;">Shipping to</p>
        <p style="margin: 0 0 24px; font-size: 14px; color: #666; line-height: 1.5;">${shippingAddress}<br>${shippingCity}, ${shippingPostalCode}<br>${shippingCountry}</p>

        <p style="margin: 0; font-size: 13px; color: #999;">We'll email you when your order ships.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const ownerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px 40px 30px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <div style="width: 60px; height: 60px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2">
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New Order Received!</h1>
                      <p style="margin: 12px 0 0; color: #ffb3b3; font-size: 16px;">Order #${order.id} from ${customerName}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Customer Info -->
            <tr>
              <td style="padding: 30px 40px 20px; border-bottom: 1px solid #f0f0f0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 8px;">
                            <span style="color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Customer Name</span><br>
                            <span style="color: #1a1a2e; font-size: 18px; font-weight: 600;">${customerName}</span>
                          </td>
                          <td align="right" style="padding-bottom: 8px;">
                            <span style="color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br>
                            <span style="color: #1a1a2e; font-size: 18px; font-weight: 600;">${customerEmail}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top: 8px;">
                            <span style="color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Amount</span><br>
                            <span style="color: #28a745; font-size: 24px; font-weight: 700;">€${totalAmount}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items Table -->
            <tr>
              <td style="padding: 30px 40px 20px;">
                <p style="margin: 0 0 16px; color: #1a1a2e; font-size: 18px; font-weight: 600;">Items Ordered</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <th style="padding: 14px 20px; text-align: left; background-color: #1a1a2e; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                    <th style="padding: 14px 20px; text-align: center; background-color: #1a1a2e; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                    <th style="padding: 14px 20px; text-align: right; background-color: #1a1a2e; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                  </tr>
                  ${orderItems
                    .map(
                      (item: any) => `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 16px 20px; font-size: 15px; color: #333333;">${item.name}</td>
                    <td style="padding: 16px 20px; text-align: center; font-size: 15px; color: #333333;">${item.quantity}</td>
                    <td style="padding: 16px 20px; text-align: right; font-size: 15px; color: #333333; font-weight: 500;">€${item.price}</td>
                  </tr>
                  `,
                    )
                    .join("")}
                </table>
              </td>
            </tr>

            <!-- Shipping & Notes -->
            <tr>
              <td style="padding: 20px 40px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="padding-bottom: 20px;">
                      <p style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px; font-weight: 600;">Shipping Address</p>
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px;">
                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">${shippingAddress}<br>${shippingCity}, ${shippingPostalCode}<br>${shippingCountry}</p>
                      </div>
                    </td>
                    ${
                      notes
                        ? `
                    <td valign="top" style="padding-bottom: 20px; padding-left: 20px;">
                      <p style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px; font-weight: 600;">Notes</p>
                      <div style="background-color: #fff3cd; border-radius: 8px; padding: 16px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">${notes}</p>
                      </div>
                    </td>
                    `
                        : ""
                    }
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    try {
      await resend.emails.send({
        from: "Draft Prototype <no-reply@draft-prototype.gr>",
        to: customerEmail,
        subject: "Order Confirmed - Draft Prototype",
        html: customerEmailHtml,
      });
    } catch (e) {
      console.error("Email send error:", e);
    }

    try {
      await resend.emails.send({
        from: "Draft Prototype <no-reply@draft-prototype.gr>",
        to: import.meta.env.OWNER_EMAIL || "echatzief97@gmail.com",
        subject: `New Order #${order.id} from ${customerName}`,
        html: ownerEmailHtml,
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
