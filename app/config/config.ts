import "dotenv/config";

import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";

/**
 * Checks if a given value is truthy.
 *
 * @param {string} value - The value to check.
 * @return {boolean} True if the value is truthy, false otherwise.
 */
const booleanify = (value: string): boolean => {
    const truthy: string[] = [
        'true',
        'True',
        '1',
    ]

    return truthy.includes(value)
}

const ConfigSchema = Type.Strict(
    Type.Object({
        NODE_ENV: Type.String(),
        LOG_LEVEL: Type.String(),
        API_HOST: Type.String(),
        API_PORT: Type.Number(),
        DB_PORT: Type.String(),
        DB_USER: Type.String(),
        DB_PASSWORD: Type.String(),
        DB_HOST: Type.String(),
        DB_NAME: Type.String(),
        JWT_SECRET: Type.String(),
        JWT_EXPIRATION: Type.String(),
        BASIC_AUTH_ENABLED: Type.Boolean(),
        BASIC_AUTH_USERNAME: Type.String(),
        BASIC_AUTH_PASSWORD: Type.String(),
        GRAPHQL_PATH: Type.String(),
    })
);
const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

// Filter and select only the keys defined in ConfigSchema from process.env
const filteredEnv: { [key: string]: string } = {};
for (const key of Object.keys(ConfigSchema.properties)) {
    if (process.env[key] !== undefined) {
        filteredEnv[key] = process.env[key]!;
    } else {
        throw new Error(`Environment variable ${key} is missing.`);
    }
}
// Validate the filtered environment against ConfigSchema
const validate = ajv.compile(ConfigSchema);
const valid = validate(filteredEnv);

if (!valid) {
    throw new Error(
        ".env file validation failed - " +
        JSON.stringify(validate.errors, null, 2)
    );
}

export const configData: Config = {
    API_HOST: filteredEnv.API_HOST,
    API_PORT: parseInt(filteredEnv.API_PORT),
    DB_HOST: filteredEnv.DB_HOST,
    DB_PORT: filteredEnv.DB_PORT,
    DB_USER: filteredEnv.DB_USER,
    DB_PASSWORD: filteredEnv.DB_PASSWORD,
    DB_NAME: filteredEnv.DB_NAME,
    LOG_LEVEL: filteredEnv.LOG_LEVEL,
    NODE_ENV: filteredEnv.NODE_ENV,
    JWT_SECRET: filteredEnv.JWT_SECRET,
    JWT_EXPIRATION: filteredEnv.JWT_EXPIRATION,
    BASIC_AUTH_ENABLED: booleanify(filteredEnv.BASIC_AUTH_ENABLED.toString()),
    BASIC_AUTH_USERNAME: filteredEnv.BASIC_AUTH_USERNAME || 'admin',
    BASIC_AUTH_PASSWORD: filteredEnv.BASIC_AUTH_PASSWORD || 'pass',
    GRAPHQL_PATH: filteredEnv.GRAPHQL_PATH || '/graphql',
};
