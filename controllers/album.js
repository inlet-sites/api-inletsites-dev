import Album from "../models/album.js";

import {HttpError} from "../HttpError.js";
import validate from "../validation/album.js";
import {unlink} from "node:fs/promises";
import sharp from "sharp";
import crypto from "crypto";

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
        res.json(responseAlbum(album));
    }catch(e){next(e)}
}

const deleteRoute = async (req, res, next)=>{
    try{
        const album = await getAlbum(req.params.albumId);
        verifyOwnership(res.locals.user, album);
        deletePhotos(album);
        await Album.deleteOne({_id: album._id});
        res.json({success: true});
    }catch(e){next(e)}
}

const addImagesRoute = async (req, res, next)=>{
    try{
        let album = await getAlbum(req.params.albumId);
        verifyOwnership(res.locals.user, album);
        album = await addImages(album, req.files.images);
        album.save();
        res.json(responseAlbum(album));
    }catch(e){next(e)}
}

const deleteImageRoute = async (req, res, next)=>{
    try{
        let album = await getAlbum(req.params.albumId);
        verifyOwnership(res.locals.user, album);
        album.photos = removeImage(album.photos, req.params.imageId);
        await album.save();
        res.json(responseAlbum(album));
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
 Update album data

 @param {Album} album - Album object
 @param {Object} data - Object containing album data to be updated
 @return {Album} - Album object
 */
const updateAlbum = (album, data)=>{
    if(data.name) album.name = data.name;
    if(data.description) album.description = data.description;
    return album;
}

/*
 Delete all photos from an album

 @param {Album} album = Album object
 */
const deletePhotos = (album)=>{
    try{
        for(let i = 0; i < album.photos.length; i++){
            unlink(`${global.cwd}/documents/${album.photos[i].file}`);
        }
    }catch(e){
        console.error(e);
        console.error(album.photos);
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
 Save images to the server
 Add image file names to the album

 @param {Album} album - Album Object
 @param {File or [File]} images - List of images uploaded
 @return {[Object]} - List of Photo objects for the album
 */
const addImages = async(album, images)=>{
    if(!images.length) images = [images];
    const promises = [];

    for(let i = 0; i < images.length; i++){
        const uuid = newUuid();
        const filename = `${uuid}.webp`;
        promises.push(
            sharp(images[i].data)
                .resize({width: 1000})
                .webp({quality: 75})
                .toFile(`${global.cwd}/documents/${filename}`)
        );
        album.photos.push({
            file: filename,
            originalName: images[i].name,
            created: new Date(),
            lastUpdated: new Date()
        });
    }

    await Promise.all(promises);
    return album;
}

/*
 Remove a single image from an album
 Also remove that image from the server

 @param {[Object]} images - photos from an album
 @param {String} imageId - ID of the image to remove
 @return {[Object]} - Updated photos list for the album
 */
const removeImage = (images, imageId)=>{
    for(let i = 0; i < images.length; i++){
        if(images[i]._id.toString() === imageId){
            unlink(`${global.cwd}/documents/${images[i].file}`);
            images.splice(i, 1);
            return images;
        }
    }
}

const newUuid = ()=>{
    return crypto.randomUUID();
}

/*
 Create an album object that is sent to the frontend

 @param {Album} album - Album Object
 @param {Object} - Object resembling album for the frontend
 */
const responseAlbum = (album)=>{
    const responseAlbum = {
        id: album._id.toString(),
        name: album.name,
        description: album.description,
        photos: [],
        created: album.created,
        lastUpdated: album.lastUpdated
    };

    for(let i = 0; i < album.photos.length; i++){
        responseAlbum.photos.push({
            id: album.photos[i]._id.toString(),
            file: album.photos[i].file,
            description: album.photos[i].description,
            created: album.photos[i].created,
            lastUpdated: album.photos[i].lastUpdated
        });
    }

    return responseAlbum;
}

export {
    createRoute,
    updateRoute,
    deleteRoute,
    addImagesRoute,
    deleteImageRoute
}
