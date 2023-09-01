
import type { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'path';

const config: CodegenConfig = {
  overwrite: true,
  schema: join(__dirname, './**/*.graphql'),
  generates: {
    "app/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "app/generated/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
