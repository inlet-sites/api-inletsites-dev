import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: String,
    sites: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    permissions: [String],
    key: {
        type: String,
        required: true
    }
});

export default mongoose.model("user", UserSchema);
