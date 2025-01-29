import User from "../models/user.js";

import {HttpError} from "../HttpError.js";
import validate from "../validation/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const createPasswordRoute = async (req, res, next)=>{
    try{
        validate({
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
        let user = await User.findOne({_id: req.params.userId});
        if(user.password) throw new HttpError(403, "Account already activated");
        compareKey(req.params.userKey, user.key);
        user.password = await hashPassword(req.body.password);
        user.key = newKey();
        await user.save();
        res.json({success: true});
    }catch(e){next(e)}
}

const getTokenRoute = async (req, res, next)=>{
    try{
        const email = req.body.email.toLowerCase();
        const user = await getUserByEmail(email);
        await comparePassword(user.password, req.body.password);
        const token = generateToken(user);
        res.json({token: token});
    }catch(e){next(e)}
}

const getUserRoute = (req, res, next)=>{
    res.json(responseUser(res.locals.user));
}

/*
 Retrieve user from data by their email

 @param {String} email - User email
 @return {User} User object
 */
const getUserByEmail = async (email)=>{
    const user = await User.findOne({email: email});
    if(!user) throw new HttpError(401, "User with this email doesn't exist");
    return user;
}

/*
 Compare user key to an input key
 Throw error if they don't match

 @param {String} key - Actual current key from the DB
 @param {String} compareKey - Input key to compare to real key
 */
const compareKey = (key, compareKey)=>{
    if(key !== compareKey) throw new HttpError(401, "Unauthorized");
}

const hashPassword = async (password)=>{
    return await bcrypt.hash(password, 10);
}

const newKey = ()=>{
    return crypto.randomUUID();
}

/*
 Check input password to DB hashed pass
 Throw error if they don't match

 @param {String} hash - Hashed password from the database
 @param {String} password - User input password
 */
const comparePassword = async (hash, password)=>{
    const result = await bcrypt.compare(password, hash);
    if(result !== true) throw new HttpError(401, "Incorrect password");
}

const generateToken = (user)=>{
    return jwt.sign({
        id: user._id,
        key: user.key
    }, process.env.JWT_SECRET);
}

const responseUser = (user)=>{
    return {
        name: user.name,
        email: user.email,
        permissions: user.permissions
    };
}

export {
    createPasswordRoute,
    getTokenRoute,
    getUserRoute
}
