import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  description: string;
  media: string[];
  authorId: string;
  authorName: string;
  likes: string[];  // 存储点赞用户的 ID
  comments: {
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  media: [{ type: String }],
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  likes: [{ type: String }],
  comments: [{
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema); 