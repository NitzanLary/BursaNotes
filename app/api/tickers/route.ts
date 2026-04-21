import { getAllTickers } from "@/lib/tickers/fetch";

export async function GET() {
  try {
    const tickers = await getAllTickers();
    return Response.json(tickers);
  } catch {
    const { KNOWN_TICKERS } = await import("@/lib/mock/tickers");
    return Response.json(Object.values(KNOWN_TICKERS));
  }
}
