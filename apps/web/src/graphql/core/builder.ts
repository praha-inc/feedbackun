import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

type Scalars = {
  ID: {
    Input: string;
    Output: string;
  };
  DateTime: {
    Input: Date;
    Output: Date;
  };
};

type Interfaces = {
  Error: {
    kind: string;
    message: string;
  };
};

export const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
  Scalars: Scalars;
  Interfaces: Interfaces;
}>({
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  plugins: [
    SimpleObjectsPlugin,
  ],
});

builder.queryType({});
