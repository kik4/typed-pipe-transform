import { describe, expect, it } from "vitest";
import { transform } from "../src/index.js";

describe("transform function", () => {
  it("should transform functions correctly", () => {
    const data = {
      inp1: 2,
      inp2: 5,
      inp3: "test",
    };

    expect(
      transform(
        data,
        ["out1", (data) => data.inp1 + data.inp2],
        ["out2", (data) => data.inp1 * data.inp2],
        ["out3", (data) => `${data.inp3}:${data.inp1},${data.inp2}`],
      ),
    ).toStrictEqual({
      out1: data.inp1 + data.inp2,
      out2: data.inp1 * data.inp2,
      out3: `${data.inp3}:${data.inp1},${data.inp2}`,
    });
  });
});
