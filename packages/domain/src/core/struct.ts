export const Struct = <Properties extends Record<string, unknown>>(): new(
  properties: Properties,
) => Readonly<Properties> => {
  abstract class Class {
    protected constructor(properties: Properties) {
      Object.assign(this, properties);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};
