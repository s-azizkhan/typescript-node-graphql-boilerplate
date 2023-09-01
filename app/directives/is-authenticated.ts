import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import { GraphQLSchema, defaultFieldResolver } from "graphql";
import { getUserFromToken } from "../utils/auth";
import _ from "lodash";

export const authDirectiveTransformer = (schema: GraphQLSchema, directiveName: string) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (source, args, context, info) => { // Provide the correct return type
          try {
            const { req } = context;

            const authToken = _.get(context, 'req.headers.authorization');
            if (!authToken) throw new Error('UNAUTHORIZED');

            const user = await getUserFromToken(_.trim(authToken));
            if (!user) throw new Error('UNAUTHORIZED');

            req.user = user;
            return await resolve(source, args, context, info);
          } catch (err) {
            console.error(`Error from graphql -> ${err}`);
            throw err;
          }
        };
      }
      return fieldConfig; // Return the modified or unmodified fieldConfig
    },
  });
};