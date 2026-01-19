import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    picture: {
        type: String,
    }

}, { timestamps: true })


const User = mongoose.model("User", UserSchema);
export default User