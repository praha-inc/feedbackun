import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
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

type Connection = {
  totalCount?: () => number | Promise<number>;
};

export const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
  DefaultEdgesNullability: false;
  Scalars: Scalars;
  Interfaces: Interfaces;
  Connection: Connection;
}>({
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  plugins: [
    RelayPlugin,
    SimpleObjectsPlugin,
  ],
  relay: {
    cursorType: 'String',
    edgesFieldOptions: {
      nullable: false,
    },
  },
});

builder.queryType({});
