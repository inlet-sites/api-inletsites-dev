import User from "../models/user.js";

import httpError from "../error.js";
import {
    hashPassword,
    newKey
} from "../controllers/user.js";

const userRoutes = (app)=>{
    /*
        POST: Activate user account and create new password
        req.body = {
            password: String
            confirmPassword: String
        }
        response = {success: true}
     */
    app.post("/user/:userId/key/:userKey", async (req, res)=>{
        let user;
        try{
            user = await User.findOne({_id: req.params.userId});
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error");
        }

        if(user.key !== req.params.userKey){
            return httpError(res, 401, "Unauthorized");
        }

        if(user.password) return httpError(res, 403, "Account already activated");

        if(req.body.password.length < 12){
            return httpError(res, 400, "Password must contain at least 12 characters");
        }

        if(req.body.password !== req.body.confirmPassword){
            return httpError(res, 400, "Passwords do not match");
        }

        user.password = await hashPassword(req.body.password);
        user.key = newKey();

        try{
            await user.save();
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error");
        }

        res.json({success: true});
    });
}

export default userRoutes;
