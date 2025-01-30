import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    createRoute,
    updateRoute,
    deleteRoute,
    addImagesRoute,
    deleteImageRoute
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    //Need to add 'originalName' to photos
    //Get album
    app.post("/album", auth("album"), createRoute);
    app.put("/album/:albumId", auth("album"), updateRoute);
    app.delete("/album/:albumId", auth("album"), deleteRoute);
    app.post("/album/:albumId/image", auth("album"), addImagesRoute);
    app.delete("/album/:albumId/image/:imageId", auth("album"), deleteImageRoute);
    //update image (adds a description to an image)
}

export default albumRoutes;
