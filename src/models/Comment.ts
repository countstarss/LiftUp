import mongoose, { Schema } from 'mongoose';

export interface Comment{
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model<Comment>('Comment', CommentSchema);
