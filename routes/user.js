import User from "../models/user.js";

import httpError from "../error.js";
import auth from "../auth.js";
import {
    createPasswordRoute,
    getTokenRoute,

    hashPassword,
    newKey,
    comparePassword,
    generateToken,
    responseUser
} from "../controllers/user.js";

const userRoutes = (app)=>{
    app.post("/user/:userId/key/:userKey", createPasswordRoute);
    app.post("/user/token", getTokenRoute);

    /*
        GET: get user data
        response = User
     */
    app.get("/user/:userId", auth, async (req, res)=>{
        res.json(responseUser(res.locals.user));
    });
}

export default userRoutes;
