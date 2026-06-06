import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt: {type: String,required: true},
    content: {type: String,required: true},
    mediaUrl: { type: String},
    mediaType: { type: String, enum: ["image", "video"]},
    tone: { type: String },
     platform: {
        type: String,
        enum: [
            "twitter",
            "linkedin",
            "facebook",
            "instagram",
            "fackebook_page",
            "linkedin_page",
            "instagram_business",
        ],
        required: true,},
        scheduledFor: { type: Date, required: true},
        status: { type: String, enum: [
            "draft", "scheduled", "published",
            "failed"], default: "scheduled"},
        

 }, { timestamps: true });

export const Post = mongoose.model("post", postSchema);