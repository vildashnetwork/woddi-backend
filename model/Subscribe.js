import  mongoose from 'mongoose'


const Subscriberschema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    }
}, {timestamps: true})

const Subscriber = mongoose.model("Subscriber", Subscriberschema)

export default Subscriber