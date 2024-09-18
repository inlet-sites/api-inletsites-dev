import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const hashPassword = async (password)=>{
    return await bcrypt.hash(password, 10);
}

const newKey = ()=>{
    return crypto.randomUUID();
}

const comparePassword = async (hash, password)=>{
    return await bcrypt.compare(password, hash);
}

const generateToken = (user)=>{
    return jwt.sign({
        id: user._id,
        key: user.key
    }, process.env.JWT_SECRET);
}

export {
    hashPassword,
    newKey,
    comparePassword,
    generateToken
};
