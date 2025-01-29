import {HttpError} from "../HttpError.js";

export default (data)=>{
    if(data.password) password(data.password, data.confirmPassword);
}

const password = (pass, comparePass)=>{
    if(pass !== comparePass) throw new HttpError(400, "Passwords do not match");
    if(pass.length < 10) throw new HttpError(400, "Password must contain at least 10 characters");
}
