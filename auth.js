import User from "./models/user.js";

import {catchError, HttpError} from "./HttpError.js";
import jwt from "jsonwebtoken";

export default (requiredPermission)=>{
    return async (req, res, next)=>{
        try{
            const [bearer, token] = req.headers.authorization.split(" ");
            if(bearer !== "Bearer") throw new HttpError(401, "Unauthorized");
            const userData = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = await getUser(userData.id, userData.key);
            checkPermissions(requiredPermission, res.locals.user.permissions);
            next();
        }catch(e){
            catchError(e, req, res, next);
        }
    }
}

/*
 Gets the user
 Throw error if bad id or key

 @param {String} id - ID of user to verify
 @param {String} key - Key of user to verify
 @return {User} - User object
 */
const getUser = async (id, key)=>{
    const user = await User.findOne({_id: id});
    if(!user) throw new HttpError(401, "Unauthorized");
    if(user.key !== key) throw new HttpError(403, "Expired token");
    return user;
}

/*
 Throw error is user does not have permissions for this route

 @param {String} needs - String representing the required permission
 @param {[String]} has - Permissions for this user
 */
const checkPermissions = (needs, has)=>{
    if(!has.includes(needs)) throw new HttpError(403, "Invalid permissions");
}

export default auth;
