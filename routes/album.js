import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    createRoute,
    updateRoute,
    deleteRoute
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.post("/album", auth("album"), createRoute);
    app.put("/album/:albumId", auth("album"), updateRoute);
    app.delete("/album/:albumId", auth("album"), deleteRoute);
    //add images
    //remove images
    //update image (adds a description to an image)
}

export default albumRoutes;
