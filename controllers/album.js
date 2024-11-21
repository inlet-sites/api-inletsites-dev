import Album from "../models/album.js";

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
    createAlbum
}
