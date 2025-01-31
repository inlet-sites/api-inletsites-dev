import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    addImagesRoute,
    deleteImageRoute,
    updateImageRoute
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.get("/album/:userId", getRoute);
    app.post("/album", auth("album"), createRoute);
    app.put("/album/:albumId", auth("album"), updateRoute);
    app.delete("/album/:albumId", auth("album"), deleteRoute);
    app.post("/album/:albumId/image", auth("album"), addImagesRoute);
    app.delete("/album/:albumId/image/:imageId", auth("album"), deleteImageRoute);
    app.put("/album/:albumId/image/:imageId", auth("album"), updateImageRoute);
}

export default albumRoutes;
