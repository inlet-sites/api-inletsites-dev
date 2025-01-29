import User from "../models/user.js";

import httpError from "../error.js";
import auth from "../auth.js";
import {
    createPasswordRoute,

    hashPassword,
    newKey,
    comparePassword,
    generateToken,
    responseUser
} from "../controllers/user.js";

const userRoutes = (app)=>{
    app.post("/user/:userId/key/:userKey", createPasswordRoute);

    /*
        POST: return token for user with correct auth
        req.body = {
            email: String
            password: String
        }
        response = {token: String}
     */
    app.post("/user/token", async (req, res)=>{
        const email = req.body.email.toLowerCase();
        let user;
        try{
            user = await User.findOne({email: email});
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error (err-003)");
        }

        if(!user) return httpError(res, 401, "User with this email doesn't exist");
        if(!await comparePassword(user.password, req.body.password)){
            return httpError(res, 401, "Incorrect password");
        }

        const token = generateToken(user);

        res.json({token: token});
    });

    /*
        GET: get user data
        response = User
     */
    app.get("/user/:userId", auth, async (req, res)=>{
        res.json(responseUser(res.locals.user));
    });
}

export default userRoutes;
