import { bench, describe } from "vitest";

type Color = "red" | "green" | "blue";
type Size = "sm" | "md";

import { cvs } from "./cvs";

describe("sort", () => {
  bench("cvs", () => {
    const result = cvs<{ color?: Color; size: Size }>({
      base: "asdf",
      variants: {
        color: {
          blue: "blue",
          green: "green",
          red: "red",
        },
        size: {
          md: "md",
          sm: "sm",
        },
      },
      defaultVariants: {
        color: "green",
      },
      compoundVariants: [
        {
          variants: {
            color: ["blue", "green"],
            size: ["md"],
          },
          value: "hhhfhh",
        },
      ],
    });
    result({ size: "md" });
  });
});
