import express from "express";
import compression from "compression";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";

const app = express();

let mongoString = "mongodb://127.0.0.1/inletsites";
if(process.env.NODE_ENV === "production"){
    mongoString = `mongodb://website:${process.env.MONGODB_PASS}@127.0.0.1:27017/inletsites?authSource=admin`;
}
mongoose.connect(mongoString);

app.use(compression());
app.use(express.json());
app.use(cors());

userRoutes(app);
blogRoutes(app);

app.get("/", (req, res)=>{res.sendFile(`${import.meta.dirname}/api.html`)});

if(process.env.NODE_ENV !== "production"){
    app.listen(8000);
}
export default app;
