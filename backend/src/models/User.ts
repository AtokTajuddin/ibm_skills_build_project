import mongoose, { Document, Schema } from 'mongoose';

interface SocialAuth {
    googleId?: string;
    firebaseUid?: string;  // Added Firebase UID support
}

export interface IUser extends Document {
    username?: string;
    name?: string;  // Added to support admin user structure
    email: string;
    password: string;
    provider: 'local' | 'google' | 'firebase';
    socialAuth?: SocialAuth;
    role?: string;  // Added to support admin role
    profilePicture?: string;  // Added for social login profile pictures
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: false, // Changed to false since admin user uses 'name' instead
        unique: true,
        sparse: true // Allows null/undefined values
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function(this: any) {
            return this.provider === 'local';
        }
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'firebase'],
        default: 'local'
    },
    socialAuth: {
        googleId: String
    },
    profilePicture: {
        type: String,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;