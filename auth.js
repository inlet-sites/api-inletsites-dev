import User from "./models/user.js";

import httpError from "./error.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next)=>{
    let userData;
    try{
        const [bearer, token] = req.headers.authorization.split(" ");
        if(bearer !== "Bearer") return httpError(res, 401, "Unauthorized");
        userData = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        return httpError(res, 401, "Unauthorized");
    }

    let user;
    try{
        user = await User.findOne({_id: userData.id});
    }catch(e){
        console.error(e);
        return httpError(res, 500, "Internal server error (err-004)");
    }

    if(!user) return httpError(res, 401, "Unauthorized");
    if(user.key !== userData.key) return httpError(res, 403, "Expired token");

    res.locals.user = user;
    next();
}

export default auth;
