import { APIGatewayEvent, Context } from "aws-lambda";

const serverlessExpress = require("@vendia/serverless-express");
import { app } from "./app";
const server = serverlessExpress.createServer(app);

exports.handler = (event: APIGatewayEvent, context: Context) => serverlessExpress.proxy(server, event, context);
