import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    createRoute,
    updateRoute
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.post("/album", auth("album"), createRoute);
    //update album
    app.put("/album/:albumId", auth("album"), updateRoute);
    //remove album
    //add images
    //remove images
    //update image (adds a description to an image)
}

export default albumRoutes;
