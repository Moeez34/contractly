import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    invoiceCount: {
        type: Number,
        default: 0,
    },
    billingCycleReset: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 1);
        },
    },
}, {
    timestamps: true,
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', userSchema);
