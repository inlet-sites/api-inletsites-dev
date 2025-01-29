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
        verifyOwnership(res.locals.user, album);
        album = updateAlbum(album, req.body);
        await album.save();
        res.json(album);
    }catch(e){next(e)}
}

/*
 Retrieve an album with the ID

 @param {String} id - ID of the album
 @return {Album} - Album object
 */
const getAlbum = async (id)=>{
    const album = await Album.findOne({_id: id});
    if(!album) throw new HttpError(400, "No album with this ID");
    return album;
}

/*
 Throw error if the album is not owned by the user

 @param {User} user - User object
 @param {Album} album - Album object
 */
const verifyOwnership = (user, album)=>{
    if(user._id.toString() !== album.user.toString()){
        throw new HttpError(403, "Forbidden");
    }
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
