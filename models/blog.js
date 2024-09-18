import mongoose from "mongoose";

const BlogSchema  = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    site: {
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
