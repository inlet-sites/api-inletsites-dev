import Album from "../models/album.js";

const createAlbumRoute = async (req, res, next)=>{
    try{
        const album = createAlbum(req.body, res.locals.user._id);
        album.save();
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
        created: new Date()
    });
}

export {
    createAlbumRoute
}
