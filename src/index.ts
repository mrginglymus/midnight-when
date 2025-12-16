import pop from "./pop.json" with { type: "json" };
import tz from "./tz.json" with { type: "json" };

const fmt = new Intl.DurationFormat(undefined, { style: "long" });

const july1 = Date.UTC(2025, 6, 1);
const jan1 = Date.UTC(2026, 0, 1);

const compute = () => {
  const now = Date.now();

  const frac = (now - july1) / (jan1 - july1);

  const [weighted, totalPop] = Object.entries(pop).reduce<[number[], number[]]>(
    ([weight, tpop], [key, value]) => {
      const tzData = tz[key as keyof typeof tz];
      if (tzData !== undefined) {
        const v = value[2025] + (value[2026] - value[2025]) * frac;
        weight.push(v * tzData);
        tpop.push(v);
      }
      return [weight, tpop];
    },
    [[], []],
  );

  const average =
    weighted.reduce((acc, val) => acc + val, 0) /
    totalPop.reduce((acc, val) => acc + val, 0);

  const msToMidnight = jan1 + average * 60 * 1000 - now;

  const days = Math.floor(msToMidnight / 1000 / 60 / 60 / 24);
  const hours = Math.floor(msToMidnight / 1000 / 60 / 60) - days * 24;
  const minutes =
    Math.floor(msToMidnight / 1000 / 60) - (days * 24 + hours) * 60;
  const seconds =
    Math.floor(msToMidnight / 1000) - ((days * 24 + hours) * 60 + minutes) * 60;

  document.querySelector("span")!.innerHTML = fmt.format({
    days,
    hours,
    minutes,
    seconds,
  });
};

compute();
setInterval(compute, 1000);
