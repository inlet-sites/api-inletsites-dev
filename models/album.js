import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: false
    },
    photos: [{
        file: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        created: {
            type: Date,
            required: true
        }
    }],
    created: {
        type: Date,
        required: true
    }
});

export default mongoose.model("album", AlbumSchema);
