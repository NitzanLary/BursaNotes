import { cacheLife } from "next/cache";
import type { Ticker } from "@/lib/types";
import {
  mergeTickers,
  parseNasdaqListed,
  parseOtherListed,
} from "@/lib/tickers/parse";

const NASDAQ_URL =
  "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt";
const OTHER_URL = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt";

export async function getAllTickers(): Promise<Ticker[]> {
  "use cache";
  cacheLife("days");

  const [nasdaqText, otherText] = await Promise.all([
    fetch(NASDAQ_URL).then((r) => r.text()),
    fetch(OTHER_URL).then((r) => r.text()),
  ]);

  return mergeTickers(
    parseNasdaqListed(nasdaqText),
    parseOtherListed(otherText),
  );
}
