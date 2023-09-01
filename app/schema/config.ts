import { operatorsAliases } from './sequelize-operators-aliases';
import { configData } from "../config/config";
import { Sequelize } from 'sequelize-typescript';
import { Dialect, PoolOptions } from "sequelize";

export interface DbConfigInterface {
    port: number | undefined,
    password: string,
    username: string,
    host: string,
    database: string,
    reconnect: boolean,
    dialect: Dialect,
    dialectOptions: {
        requestTimeout: number,
    },
    pool: PoolOptions,
    migrationStorageTableName: '_migrations',
};

const dbConfig: DbConfigInterface = {
    port: configData.DB_PORT ? +configData.DB_PORT : 5432,
    password: configData.DB_PASSWORD,
    username: configData.DB_USER,
    host: configData.DB_HOST,
    database: configData.DB_NAME,
    reconnect: true,
    dialect: 'postgres',
    dialectOptions: {
        requestTimeout: 3000,
    },
    pool: {
        max: 6000,
        min: 0,
        acquire: 60000,
        idle: 5000,
    },
    migrationStorageTableName: '_migrations',
};

export const sequelizeConnection = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    operatorsAliases,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: false,
    //models: [__dirname + '/**/*.model.ts'],
    models: [__dirname + '/**/*.model.ts'],
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
});

export default sequelizeConnection;
