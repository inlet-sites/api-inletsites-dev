import express from "express";
import compression from "compression";

const app = express();

app.use(compression());

import userRoutes from "./routes/user.js";
userRoutes(app);

if(process.env.NODE_ENV !== "production"){
    app.listen(8000);
}
export default app;
