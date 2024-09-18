import bcrypt from "bcrypt";
import crypto from "crypto";

const hashPassword = async (password)=>{
    return await bcrypt.hash(password, 10);
}

const newKey = ()=>{
    return crypto.randomUUID();
}

export {
    hashPassword,
    newKey
};
