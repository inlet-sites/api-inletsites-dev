import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    createAlbumRoute
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.post("/album", auth("album"), createAlbumRoute);
}

export default albumRoutes;
