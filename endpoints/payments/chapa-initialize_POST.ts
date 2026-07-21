import { schema, OutputType } from "./chapa-initialize_POST.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const txRef = `EB-TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

    if (chapaSecretKey && chapaSecretKey.startsWith("CHASECK")) {
      // Real Chapa API Call
      const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${chapaSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: validated.amount.toString(),
          currency: "ETB",
          email: validated.email,
          first_name: validated.firstName,
          last_name: validated.lastName,
          phone_number: validated.phoneNumber,
          tx_ref: txRef,
          customization: {
            title: "Ethiopian Stays - " + validated.title,
            description: "Accommodation Booking Payment",
          },
        }),
      });

      const chapaData = await chapaResponse.json();

      if (chapaData.status === "success" && chapaData.data?.checkout_url) {
        return new Response(
          superjson.stringify({
            checkoutUrl: chapaData.data.checkout_url,
            txRef,
            isSimulated: false,
          } satisfies OutputType),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Mock / Demo Fallback Mode
    return new Response(
      superjson.stringify({
        checkoutUrl: `https://checkout.chapa.co/checkout/payment/${txRef}`,
        txRef,
        isSimulated: true,
      } satisfies OutputType),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      superjson.stringify({ error: error.message || "Failed to initialize payment" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
