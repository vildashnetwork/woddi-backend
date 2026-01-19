import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
    MTN: {
        type: String,
        required: true
    },
    Orange: {
        type: String,
        required: true
    },
    confrimationname: {
        type: String,
        required: true
    },
    BankName: {
        type: String,
        required: true
    },
    AccountNumber: {
        type: String,
        required: true
    },
    SWIFTcode: {
        type: String,
        required: true
    },
    DonationTitle: {
        type: String,
        required: true
    },
    DonationMessage: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Donation = mongoose.model('Donation', DonationSchema);

export default Donation;