import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
