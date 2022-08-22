import { APIGatewayEvent, Context } from "aws-lambda";

import { app } from "./app";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serverlessExpress = require("@vendia/serverless-express");

const server = serverlessExpress.createServer(app);

exports.handler = (event: APIGatewayEvent, context: Context) => serverlessExpress.proxy(server, event, context);
