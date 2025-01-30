import express from "express";
import compression from "compression";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

import {catchError} from "./HttpError.js";

import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";
import albumRoutes from "./routes/album.js";

const app = express();
global.cwd = `${import.meta.dirname}`;

let mongoString = "mongodb://127.0.0.1/inletsites";
if(process.env.NODE_ENV === "production"){
    mongoString = `mongodb://website:${process.env.MONGODB_PASS}@127.0.0.1:27017/inletsites?authSource=admin`;
}
mongoose.connect(mongoString);

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(fileUpload({limits: {fileSize: 15 * 1024 * 1024}}));

userRoutes(app);
blogRoutes(app);
albumRoutes(app);

app.use(catchError);

app.get("/", (req, res)=>{res.sendFile(`${import.meta.dirname}/api.html`)});

if(process.env.NODE_ENV !== "production"){
    app.listen(8000);
}
export default app;
