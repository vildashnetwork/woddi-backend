import mongoose from "mongoose"


const adminSettings = new mongoose.Schema({
    EmailNotifications: {
        type: Boolean,
        default: true
    },
    BrowserNotifications: {
        type: Boolean,
        default: false
    },
    NewComments: {
        type: Boolean,
        default: true
    }
})

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        type: adminSettings,
        default: () => ({})
    }
}, { timestamps: true })

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin