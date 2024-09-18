import User from "../models/user.js";

import httpError from "../error.js";

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
        try{
            const user = await User.find({_id: req.params.userId});
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error");
        }
        
        if(user.key !== req.params.userKey){
            return httpError(res, 401, "Unauthorized");
        }

        if(req.body.password.length < 12){
            return httpError(res, 400, "Password must contain at least 12 characters");
        }

        if(req.body.password !== req.body.confirmPassword){
            return httpError(res, 400, "Passwords do not match");
        }

        setPassword(user, req.body.password);

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
