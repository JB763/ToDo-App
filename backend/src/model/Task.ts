import mongoose, {Document, Schema, Types} from 'mongoose';

export interface ITask extends Document {
    title: string,
    description: string,
    completed: boolean,
    user: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    //referencia a user desde task, enlazamos tareas con usuarios
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true
});

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;