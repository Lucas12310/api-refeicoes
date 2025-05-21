import express from "express";
import cors from "cors";
import { conectarBanco } from "./config/dbConnect.js";
import routes from "./routes/index.js";

await conectarBanco();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

routes(app);

export default app;