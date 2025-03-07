import cors from "cors";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app: Express = express();
const port: number = parseInt(process.env.PORT || "4000");

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

async function main(): Promise<void> {
  app.use("/api/v1", routes);
}

main()
  .then(async () => {
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });

app.listen(port, "0.0.0.0", (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
