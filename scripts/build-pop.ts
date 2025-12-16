import { parse } from "csv-parse";
import * as fs from "node:fs/promises";

const parser = parse(
  await fs.readFile("./data/WPP2024_Demographic_Indicators_Medium.csv"),
  { columns: true },
);

const data: Record<string, { 2025?: number; 2026?: number }> = {};

for await (const record of parser) {
  if (!record.ISO2_code) {
    continue;
  }
  if (record.Time === "2025") {
    (data[record.ISO2_code] ??= {})[2025] = parseFloat(record.TPopulation1July);
  }
  if (record.Time === "2026") {
    (data[record.ISO2_code] ??= {})[2026] = parseFloat(record.TPopulation1Jan);
  }
}

await fs.writeFile("./src/pop.json", JSON.stringify(data, null, 2), "utf-8");
