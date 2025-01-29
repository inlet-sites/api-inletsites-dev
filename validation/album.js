import {HttpError} from "../HttpError.js";

export default (data)=>{
    if(data.name) vName(data.name);
    if(data.description) description(data.description);
}

const vName = (name)=>{
    if(typeof name !== "string") throw new HttpError(400, "Invalid name");
    if(name.length > 100) throw new HttpError(400, "Name is too long");
}

const description = (description)=>{
    if(typeof description !== "string") throw new HttpError(400, "Invalid description");
}
