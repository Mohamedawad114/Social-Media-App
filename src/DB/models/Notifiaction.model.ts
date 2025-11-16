import mongoose from "mongoose";
import { INotification } from "../../common";

 
const notifiactionSchema = new mongoose.Schema<INotification>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps:true
}
)
const NotifiactionModel = mongoose.model<INotification>('Notification', notifiactionSchema);
export {NotifiactionModel}