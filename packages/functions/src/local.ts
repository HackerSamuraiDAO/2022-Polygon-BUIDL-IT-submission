import * as dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
