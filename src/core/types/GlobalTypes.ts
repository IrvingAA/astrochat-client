/**
 * Array of objects
 */
export type ArrayOfObjects = Record<string, any>[];

/**
 * Make all properties of an interface optional
 */
export type MakePropertiesOptional<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends File // Manejar el tipo File específicamente
      ? T[K]
      : MakePropertiesOptional<T[K]>
    : T[K];
};
/**
 * Make all properties of an interface nullable
 */
export type MakePropertiesNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends File // Manejar el tipo File específicamente
      ? T[K] | null
      : MakePropertiesNullable<T[K]>
    : T[K] | null;
};

// {a: {b: 1, c: {d: 1}}} => {"a.b": 1, "a.b.c.d": 1}
export type Flatten<T> = object extends T
  ? object
  : {
        [K in keyof T]-?: (
          x: NonNullable<T[K]> extends infer V
            ? V extends object
              ? V extends readonly any[]
                ? Pick<T, K>
                : V extends File // Manejar el tipo File específicamente
                  ? Pick<T, K>
                  : Flatten<V> extends infer FV
                    ? {
                        [P in keyof FV as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: FV[P];
                      }
                    : never
              : Pick<T, K>
            : never
        ) => void;
      } extends Record<keyof T, (y: infer O) => void>
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      O extends infer U
      ? { [K in keyof O]: O[K] }
      : never
    : never;

/**
 * Array with flatten objects
 */
export type FlattenArray<T extends ArrayOfObjects> = Flatten<T[number]>[];

/**
 * Object of T
 */
export type ObjectOfIC<T extends ArrayOfObjects> = T[number];

/**
 * Type for ref components
 */
// eslint-disable-next-line
export type RefComponentIC<T> = T extends new () => infer T ? T : never;
