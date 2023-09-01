import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers, typeDefs } from '.'
import { GraphQLSchema } from 'graphql';
import { authDirectiveTransformer } from '../directives/is-authenticated';

interface DirectivesObject {
    [key: string]: (schema: GraphQLSchema, directiveName: string) => GraphQLSchema;
}
const directivesObj: DirectivesObject = {
    isAuthenticated: authDirectiveTransformer,
};
export const schema = (): GraphQLSchema => {
    let schemaData = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    for (const directive in directivesObj) {
        schemaData = directivesObj[directive](schemaData, directive);
    }
    return schemaData;
};