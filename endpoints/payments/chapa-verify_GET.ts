import { OutputType } from "./chapa-verify_GET.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const txRef = url.searchParams.get("txRef");

    if (!txRef) {
      return new Response(superjson.stringify({ error: "Missing txRef parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

    if (chapaSecretKey && chapaSecretKey.startsWith("CHASECK")) {
      const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(txRef)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${chapaSecretKey}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        return new Response(
          superjson.stringify({
            status: "success",
            message: data.message || "Payment verified successfully",
            txRef,
            amount: data.data?.amount,
          } satisfies OutputType),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        superjson.stringify({
          status: data.status || "failed",
          message: data.message || "Payment verification failed",
          txRef,
        } satisfies OutputType),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Mock verification fallback
    return new Response(
      superjson.stringify({
        status: "success",
        message: "Simulated payment verified",
        txRef,
      } satisfies OutputType),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      superjson.stringify({ error: error.message || "Verification failed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
