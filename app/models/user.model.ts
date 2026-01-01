import mongoose, { Schema, Model } from 'mongoose';

export interface ISocialLinks {
    github?: string;
    gitlab?: string;
    medium?: string;
    devto?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
}

export interface IUser {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
    socialLinks?: ISocialLinks;
    profileCompleted: boolean;
    videoUrl?: string;
    videoRecorded: boolean;
    videoRecordedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        googleId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        picture: {
            type: String,
        },
        socialLinks: {
            github: { type: String, trim: true },
            gitlab: { type: String, trim: true },
            medium: { type: String, trim: true },
            devto: { type: String, trim: true },
            twitter: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            website: { type: String, trim: true },
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
        videoUrl: {
            type: String,
            trim: true,
        },
        videoRecorded: {
            type: Boolean,
            default: false,
        },
        videoRecordedAt: {
            type: Date,
        },
        lastLoginAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
