import Album from "../models/album.js";

import validate from "../validation/album.js";

const createRoute = async (req, res, next)=>{
    try{
        validate(req.body);
        const album = createAlbum(req.body, res.locals.user._id);
        await album.save();
        res.json(responseAlbum(album));
    }catch(e){next(e)}
}

const updateRoute = async (req, res, next)=>{
    try{
        validate(req.body);
        let album = await getAlbum(req.params.albumId);
        verifyOwnership(user, album);
        album = updateAlbum(album, req.body);
        await album.save();
        res.json(album);
    }catch(e){next(e)}
}

/*
 Create a new Album with no images
 
 @param {Object} data - Body object containing data
 @param {String} userId - ID of the user
 */
const createAlbum = (data, userId)=>{
    return new Album({
        name: data.name,
        user: userId,
        description: data.description,
        photos: [],
        created: new Date(),
        lastUpdated: new Date()
    });
}

/*
 Create an album object that is sent to the frontend

 @param {Album} album - Album Object
 @param {Object} - Object resembling album for the frontend
 */
const responseAlbum = (album)=>{
    return {
        name: album.name,
        description: album.description,
        photos: album.photos,
        created: album.created,
        lastUpdated: album.lastUpdated
    };
}

export {
    createRoute,
    updateRoute
}
