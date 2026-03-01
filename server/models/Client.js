import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        default: '',
        trim: true,
    },
    address: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

export default mongoose.model('Client', clientSchema);
