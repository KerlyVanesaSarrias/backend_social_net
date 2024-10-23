import dotenv from "dotenv";
import connection from "./database/connection.js";
import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import userRoutes from "./routes/users.js"
import publicationRoutes from "./routes/publications.js"
import followRoutes from "./routes/follows.js"



dotenv.config();

console.log("API en ejecución");

connection();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user', userRoutes)
app.use('/api/plublication', publicationRoutes)
app.use('/api/follow', followRoutes)

app.listen(port, () => {
    console.log("Servidor en ejecución en el puerto", port);
});

export default app;