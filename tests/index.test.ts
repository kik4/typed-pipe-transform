import { describe, expect, it } from "vitest";
import { transform } from "../src/index.js";

// Compile-time type tests
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

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

  it("nested props", () => {
    const data = {
      x: 2,
      y: 5,
    };

    expect(
      transform(data, [["a", "b"], (data) => data.x + data.y]),
    ).toStrictEqual({
      a: { b: data.x + data.y },
    });
  });

  it("deep nested props", () => {
    const data = {
      x: 2,
      y: 5,
      z: 10,
    };

    expect(
      transform(data, [["a", "b", "c"], (data) => (data.x + data.y) * data.z]),
    ).toStrictEqual({
      a: { b: { c: (data.x + data.y) * data.z } },
    });
  });

  it("should have correct static type inference", () => {
    const data = { x: 2, y: 5, name: "test" };

    // Test flat properties
    const result1 = transform(
      data,
      ["sum", (data) => data.x + data.y],
      ["greeting", (data) => `Hello ${data.name}`],
    );

    // Static type test for flat properties
    type Test1 = Expect<
      Equal<typeof result1, { sum: number; greeting: string }>
    >;

    // Test nested properties
    const result2 = transform(data, [
      ["nested", "value"],
      (data) => data.x * data.y,
    ]);

    // Static type test for nested properties
    type Test2 = Expect<Equal<typeof result2, { nested: { value: number } }>>;

    // Test mixed flat and nested
    const result3 = transform(
      data,
      ["flat", (data) => data.x],
      [["deep", "nested"], (data) => data.name],
    );

    // Static type test for mixed properties
    type Test3 = Expect<
      Equal<typeof result3, { flat: number; deep: { nested: string } }>
    >;

    // Test deep nested
    const result4 = transform(data, [
      ["deep", "deep", "nested"],
      (data) => data.name,
    ]);

    // Static type test for mixed properties
    type Test4 = Expect<
      Equal<typeof result4, { deep: { deep: { nested: string } } }>
    >;

    // Runtime assertions to ensure the test actually runs
    expect(result1).toEqual({ sum: 7, greeting: "Hello test" });
    expect(result2).toEqual({ nested: { value: 10 } });
    expect(result3).toEqual({ flat: 2, deep: { nested: "test" } });
    expect(result4).toEqual({ deep: { deep: { nested: "test" } } });
  });
});
