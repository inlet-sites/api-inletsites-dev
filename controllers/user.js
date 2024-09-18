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

const responseUser = (user)=>{
    return {
        name: user.name,
        email: user.email,
        permissions: user.permissions,
        site: user.site
    };
}

export {
    hashPassword,
    newKey,
    comparePassword,
    generateToken,
    responseUser
};
