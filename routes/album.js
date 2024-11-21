import Album from "../models/album.js";

import httpError from "../error.js";
import auth from "../auth.js";
import {
    createAlbum
} from "../controllers/album.js";

const albumRoutes = (app)=>{
    app.post("/album", auth, async (req, res)=>{
        const album = createAlbum(req.body, res.locals.user._id);

        try{
            album.save();
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error (err-001)");
        }

        res.json(album);
    });
}

export default albumRoutes;
