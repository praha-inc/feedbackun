export const CustomError = <Name extends string>(
  options: { name: Name; message: string },
): new(options?: ErrorOptions) => Readonly<{ name: Name; message: string }> => {
  abstract class Class extends Error {
    public override readonly name = options.name;
    public static readonly message = options.message;

    protected constructor(options?: ErrorOptions) {
      super(Class.message, options);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};
