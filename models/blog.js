import mongoose from "mongoose";

const BlogSchema  = new mongoose.Schema({
    site: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        unique: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    url: {
        type: String,
        required: true,
        index: true,
        unique: false
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
});

export default mongoose.model("blog", BlogSchema);
