import { ApolloServer, } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express'
import http from 'http';
import cors from 'cors'
import sequelizeConnection from './schema/config';
import { schema } from './modules/Schema';
import { configData } from './config/config';
import basicAuthMiddleware from './utils/basic-auth-middleware';
import { Sequelize } from 'sequelize';
import { GraphQLSchema } from 'graphql';
import UserInterface from './interfaces/user.interface';

export interface GraphQlContext {
  req?: {
    user: UserInterface
  }
}

class Server<port extends number, GraphQLRoute extends string, SequelizeConn extends Sequelize, schema extends GraphQLSchema> {

  private _apolloServer: ApolloServer<GraphQlContext>;
  private _app: express.Application;
  private _port: port;
  private _graphqlRoute: GraphQLRoute;
  private _httpServer: http.Server;
  private _sequelizeConnection: SequelizeConn;
  private _schema: schema;

  constructor(port: port, graphqlRoute: GraphQLRoute, sequelizeConnection: SequelizeConn, schema: schema) {
    this._port = port;
    this._graphqlRoute = graphqlRoute;
    this._sequelizeConnection = sequelizeConnection;
    this._schema = schema;
    this._app = express();
    this._httpServer = http.createServer(this._app);

    this._apolloServer = this._startApolloServer(this._httpServer);
  }
  serve() {
    this._sequelizeConnection.sync().then(async () => {
      this._startServer();
    });
  }
  async applyMiddleware() {

    await this._apolloServer.start();
    if (configData.BASIC_AUTH_ENABLED) {
      // apply basic auth for playground access
      this._app.get(this._graphqlRoute, basicAuthMiddleware);
    }


    const server = this._apolloServer;
    // Specify the path where we'd like to mount our server
    this._app.use(
      this._graphqlRoute,
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          return { req };
        },
      }),
    );

    return this;
  }
  private _startApolloServer(httpServer: http.Server) {

    return new ApolloServer<GraphQlContext>({
      schema: this._schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
      csrfPrevention: true,
      formatError: error => {
        // remove the internal sequelize error message
        // leave only the important validation error
        const message = error.message
          .replace('SequelizeValidationError: ', '')
          .replace('Validation error: ', '');

        return {
          ...error,
          message,
        };
      },
    });

  }

  private async _startServer() {
    await new Promise<void>((resolve) => this._httpServer.listen({ port: this._port }, resolve));
    console.log(`🚀 WooHooo Server ready at http://localhost:${this._port}${this._graphqlRoute}`);
  }
}

new Server(configData.API_PORT, configData.GRAPHQL_PATH, sequelizeConnection, schema()).applyMiddleware().then((server) => {
  server.serve();
});