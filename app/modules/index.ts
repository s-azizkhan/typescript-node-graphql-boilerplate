import { join } from "path";
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files'

const resolversPath = join(__dirname, './**/*.resolvers.ts');
const typesPath = join(__dirname, './**/*.graphql');

const typesArray = loadFilesSync(typesPath);
const resolverArray = loadFilesSync(resolversPath);

export const resolvers = mergeResolvers(resolverArray);
export const typeDefs = mergeTypeDefs(typesArray);
