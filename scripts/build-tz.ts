import * as fs from "node:fs/promises";
import { getTimeZones } from "@vvo/tzdb";

const tz = Object.fromEntries(
  Object.entries(
    getTimeZones().reduce<Record<string, number[]>>(
      (acc, { countryCode, currentTimeOffsetInMinutes }) => {
        (acc[countryCode] ??= []).push(currentTimeOffsetInMinutes);
        return acc;
      },
      {},
    ),
  ).map(([cc, offsets]) => [
    cc,
    offsets.reduce((acc, offset) => acc + offset) / offsets.length,
  ]),
);

await fs.writeFile("./src/tz.json", JSON.stringify(tz, null, 2), "utf-8");
