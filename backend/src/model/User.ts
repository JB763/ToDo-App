import mongoose, {Document, Schema, Types} from 'mongoose';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    age: number,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
}, 
{
    timestamps: true
})

const User = mongoose.model<IUser>("User", userSchema);
export default User;
