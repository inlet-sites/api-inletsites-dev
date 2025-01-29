import Album from "../models/album.js";

import httpError from "../error.js";
import {HttpError} from "../HttpError.js";
import auth from "../auth.js";
import {
    createAlbum
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.post("/album", auth, async (req, res)=>{
        try{
            const album = createAlbum(req.body, res.locals.user._id);
            album.save();
            res.json(album);
        }catch(e){next(e)}
    });
}

export default albumRoutes;
