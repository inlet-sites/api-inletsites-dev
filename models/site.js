import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owners: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    }
});

export default mongoose.model("site", SiteSchema);
