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
            return httpError(res, 500, "Internal server error (err-001)");
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
            return httpError(res, 500, "Internal server error (err-002)");
        }

        res.json({success: true});
    });

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
        if(!comparePass(user.password, req.body.password)){
            return httpError(res, 401, "Incorrect password");
        }

        const token = generateToken(user);

        res.json({token: token});
    });
}

export default userRoutes;
