type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type WithType<T extends Record<string, string>> = {
  base?: string;
  variants?: ValueMap2<T>;
  defaultVariants?: ModifyType2<T>;
  compoundVariants?: {
    variants: Partial<{
      [key in keyof T]: T[key][];
    }>;
    value: string;
  }[];
};

type WithoutType<D extends Record<string, Record<string, string>> | undefined> =
  {
    base?: string;
    variants?: D;
    defaultVariants?: Partial<ValueMapWithoutType2<D>>;
    compoundVariants?: {
      variants: Partial<{
        [key in keyof D]: (keyof D[key])[];
      }>;
      value: string;
    }[];
  };

type ValueMap2<T extends Record<string, string>> = {
  [K in keyof T]: Record<T[K], string>;
};

type ModifyType2<T> = Partial<Pick<T, RequiredKeys<T>>> &
  Required<Pick<T, OptionalKeys<T>>>;

type ValueMapWithoutType2<
  T extends Record<string, Record<string, string>> | undefined
> = {
  [K in keyof T]: keyof T[K];
};

type CVS<
  T extends Record<string, string> | undefined = undefined,
  D extends Record<string, Record<string, string>> | undefined = undefined
> = T extends Record<string, string> ? WithType<T> : WithoutType<D>;

function hasKey<T extends object>(obj: T, key: keyof any): key is keyof T {
  return key in obj;
}

function isSubset2(
  compoundVariant: Record<string, string[] | undefined>,
  variant: Record<string, string>,
  defaultVariant: Record<string, unknown> | undefined
): boolean {
  for (const key in compoundVariant) {
    const value1 = compoundVariant[key];
    if (value1 !== undefined) {
      const value2 = variant[key];
      if (value2 !== undefined && value1.includes(value2)) {
        continue;
      } else if (
        value2 === undefined &&
        defaultVariant &&
        key in defaultVariant
      ) {
        continue;
      }
      return false;
    }
  }
  return true;
}

export const cvs = <
  T extends Record<string, string> | undefined = undefined,
  D extends Record<string, Record<string, string>> | undefined = undefined
>(
  args1: CVS<T, D>
) => {
  const base = args1.base;
  const variantsKeys = args1.variants
    ? (Object.keys(args1.variants) as (keyof typeof args1.variants)[])
    : [];

  return (
    args2: T extends Record<string, string>
      ? T
      : Partial<ValueMapWithoutType2<D>>
  ): string => {
    const result: string[] = [];

    if (base !== undefined) {
      result.push(base);
    }

    const unsafeArgs2 = args2 as Record<string, string>;

    for (let index = 0; index < variantsKeys.length; index++) {
      const variantKey = variantsKeys[index];

      let value: string | undefined;

      if (variantKey) {
        const selectedValueKey = unsafeArgs2[variantKey];
        if (selectedValueKey !== undefined) {
          value = args1.variants?.[variantKey]?.[selectedValueKey];
        } else {
          if (
            args1.defaultVariants &&
            hasKey(args1.defaultVariants, variantKey)
          ) {
            const defaultVariantValue = args1.defaultVariants[variantKey];
            const variantsValue = args1.variants?.[variantKey];

            if (
              variantsValue &&
              defaultVariantValue &&
              hasKey(variantsValue, defaultVariantValue)
            ) {
              value = variantsValue[defaultVariantValue];
            }
          }
        }
      }

      if (value !== undefined) {
        result.push(value);
      }
    }

    const compoundVariants = args1.compoundVariants;

    if (compoundVariants) {
      for (const cur of compoundVariants) {
        const variants = cur.variants as Partial<Record<string, string[]>>;

        const value = cur.value;

        const isVariantSubset = isSubset2(
          variants,
          unsafeArgs2,
          args1.defaultVariants
        );

        if (isVariantSubset) {
          result.push(value);
        }
      }
    }

    return result.join(" ");
  };
};
