import { cvs } from "./cvs";
import { expect, describe, it } from "vitest";

const BASE_TEXT = "hello world" as const;
const COLOR_VARIANT = {
  RED: "text-red",
  GREEN: "text-green",
  BLUE: "text-blue",
} as const;
const SIZE_VARIANT = {
  SMALL: "h-small",
  MEDIUM: "h-medium",
  LARGE: "h-large",
} as const;

type Variant = {
  color: "red" | "green" | "blue";
  size: "small" | "medium" | "large";
};

describe("bva", () => {
  it("should return base if there is only base", () => {
    const baseWithoutTypes = cvs({
      base: BASE_TEXT,
    });
    // TOFIX: don't have to enter undefined
    expect(baseWithoutTypes(undefined)).toBe(BASE_TEXT);
  });
  it("should return base if there is only base with types", () => {
    const BASE_TEXT = "hello world" as const;
    const baseWithTypes = cvs<{}>({
      base: BASE_TEXT,
    });
    // TOFIX: don't have to enter {}
    expect(baseWithTypes({})).toBe(BASE_TEXT);
  });

  it("should return correct value when enter variant", () => {
    const baseWithoutTypes = cvs({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
    });

    const value = baseWithoutTypes({ color: "green", size: "medium" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.GREEN} ${SIZE_VARIANT.MEDIUM}`
    );
  });

  it("should return correct value when enter variant with types", () => {
    const baseWithTypes = cvs<Variant>({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
    });

    const value = baseWithTypes({ color: "green", size: "medium" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.GREEN} ${SIZE_VARIANT.MEDIUM}`
    );
  });
  it("should return correct value when enter compound variant", () => {
    const baseWithTypes = cvs({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      compoundVariants: [
        // Success Case
        {
          value: "success-1",
          variants: {
            color: ["green"],
            size: ["large"],
          },
        },
        {
          value: "success-2",
          variants: {
            color: ["green"],
          },
        },
        {
          value: "success-3",
          variants: {
            size: ["large"],
          },
        },

        {
          value: "success-4",
          variants: {
            color: ["green", "blue"],
            size: ["large"],
          },
        },
        {
          value: "success-5",
          variants: {
            color: ["blue", "green"],
            size: ["large"],
          },
        },
        {
          value: "success-6",
          variants: {
            color: ["green", "green"],
            size: ["large"],
          },
        },

        // Fail case
        {
          value: "fail-1",
          variants: {
            color: ["green"],
            size: ["small"],
          },
        },
        {
          value: "fail-2",
          variants: {
            color: ["blue"],
            size: ["large"],
          },
        },
        {
          value: "fail-3",
          variants: {
            color: ["green"],
            size: [],
          },
        },
        {
          value: "fail-4",
          variants: {
            color: [],
            size: ["large"],
          },
        },
      ],
    });

    const valueWithNoArgs = baseWithTypes({});
    expect(valueWithNoArgs).toBe(BASE_TEXT);

    const value = baseWithTypes({ color: "green", size: "large" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.GREEN} ${SIZE_VARIANT.LARGE} success-1 success-2 success-3 success-4 success-5 success-6`
    );
  });
  it("should return correct value when enter compound variant with types", () => {
    const baseWithTypes = cvs<Variant>({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      compoundVariants: [
        // Success Case
        {
          value: "success-1",
          variants: {
            color: ["green"],
            size: ["large"],
          },
        },
        {
          value: "success-2",
          variants: {
            color: ["green"],
          },
        },
        {
          value: "success-3",
          variants: {
            size: ["large"],
          },
        },

        {
          value: "success-4",
          variants: {
            color: ["green", "blue"],
            size: ["large"],
          },
        },
        {
          value: "success-5",
          variants: {
            color: ["blue", "green"],
            size: ["large"],
          },
        },
        {
          value: "success-6",
          variants: {
            color: ["green", "green"],
            size: ["large"],
          },
        },

        // Fail case
        {
          value: "fail-1",
          variants: {
            color: ["green"],
            size: ["small"],
          },
        },
        {
          value: "fail-2",
          variants: {
            color: ["blue"],
            size: ["large"],
          },
        },
        {
          value: "fail-3",
          variants: {
            color: ["green"],
            size: [],
          },
        },
        {
          value: "fail-4",
          variants: {
            color: [],
            size: ["large"],
          },
        },
      ],
    });

    const value = baseWithTypes({ color: "green", size: "large" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.GREEN} ${SIZE_VARIANT.LARGE} success-1 success-2 success-3 success-4 success-5 success-6`
    );
  });

  it("should return correct value when enter default variant", () => {
    const base = cvs({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      defaultVariants: {
        color: "blue",
        size: "medium",
      },
    });
    const value = base({});
    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.BLUE} ${SIZE_VARIANT.MEDIUM}`
    );
    const valueWithOverride = base({ color: "green" });
    expect(valueWithOverride).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.GREEN} ${SIZE_VARIANT.MEDIUM}`
    );
  });
  it("should return correct value when enter default variant with types", () => {
    const base = cvs<Variant>({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      defaultVariants: {},
    });
    const baseWithPartial = cvs<
      Omit<Variant, "color"> & Partial<Pick<Variant, "color">>
    >({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      defaultVariants: {
        color: "blue",
      },
    });

    const value = base({ color: "blue", size: "medium" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.BLUE} ${SIZE_VARIANT.MEDIUM}`
    );

    const valueWithPartial = baseWithPartial({ size: "large" });
    expect(valueWithPartial).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.BLUE} ${SIZE_VARIANT.LARGE}`
    );
  });
  it("should return correct value when enter compound variant with default variant", () => {
    const base = cvs({
      base: BASE_TEXT,
      variants: {
        color: {
          red: COLOR_VARIANT.RED,
          green: COLOR_VARIANT.GREEN,
          blue: COLOR_VARIANT.BLUE,
        },
        size: {
          small: SIZE_VARIANT.SMALL,
          medium: SIZE_VARIANT.MEDIUM,
          large: SIZE_VARIANT.LARGE,
        },
      },
      compoundVariants: [
        {
          value: "compound-1",
          variants: {
            color: ["blue"],
            size: ["medium"],
          },
        },
      ],
      defaultVariants: {
        size: "medium",
        color: "blue",
      },
    });

    const value = base({ color: "blue" });
    const value2 = base({});
    const value3 = base({ color: "red" });
    const value4 = base({ color: "red", size: "medium" });

    expect(value).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.BLUE} ${SIZE_VARIANT.MEDIUM} compound-1`
    );
    expect(value2).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.BLUE} ${SIZE_VARIANT.MEDIUM} compound-1`
    );
    expect(value3).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.RED} ${SIZE_VARIANT.MEDIUM}`
    );
    expect(value4).toBe(
      `${BASE_TEXT} ${COLOR_VARIANT.RED} ${SIZE_VARIANT.MEDIUM}`
    );
  });
});
