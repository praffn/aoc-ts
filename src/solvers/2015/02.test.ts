import test from "node:test";
import { computeRequiredWrappingMaterials } from "./02";

test("2015-02", (t) => {
  const cases = [
    {
      input: [2, 3, 4] as const,
      paper: 58,
      ribbon: 34,
    },
    {
      input: [1, 1, 10] as const,
      paper: 43,
      ribbon: 14,
    },
  ] as const;

  for (const cas of cases) {
    const [paper, ribbon] = computeRequiredWrappingMaterials(
      cas.input[0],
      cas.input[1],
      cas.input[2]
    );
    t.assert.equal(
      paper,
      cas.paper,
      `paper: ${cas.input} => ${cas.paper} (actual: ${paper})`
    );
    t.assert.equal(
      ribbon,
      cas.ribbon,
      `ribbon: ${cas.input} => ${cas.ribbon} (actual: ${ribbon})`
    );
  }
});
