import mongoose from "mongoose";
import { Document } from "mongoose";

export interface INotification extends Document{
    userId: string | mongoose.Types.ObjectId;
    title: string;
    content: string;
    isRead:boolean
}