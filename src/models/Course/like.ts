import mongoose, { Schema, Document } from "mongoose";

export interface LikeDocument extends Document {
  userId: string;
  courseId: string;
  chapterId: string;
  createdAt: Date;
}

const likeSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  chapterId: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

// 创建复合索引确保唯一性
likeSchema.index({ userId: 1, courseId: 1, chapterId: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model<LikeDocument>("Like", likeSchema); 