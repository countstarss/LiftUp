import mongoose, { Document, Schema, Model } from "mongoose";
import { ChapterDocument, ChapterSchema } from "./chapter";

// Course Schema
const CourseSchema = new Schema(
  {
    courseId: { type: String, required: false, default: () => new mongoose.Types.ObjectId().toString() ,unique: true},
    title: { type: String, required: true }, // 课程标题
    description: { type: String }, // 课程描述
    userId: { type: String, required: false }, // 用户ID
    chapters: {
      type: [ChapterSchema], // 嵌套 ChapterSchema
      default: [], // 默认值为空数组
    },
  },
  { timestamps: true } // 自动添加 createdAt 和 updatedAt
);

// Course Interface
export interface CourseDocument extends Document {
  courseId: string;
  title: string;
  description?: string;
  userId: string;
  chapters: ChapterDocument[]; // 嵌套章节
}

// Course Model
const Course: Model<CourseDocument> =
  mongoose.models.Course || mongoose.model<CourseDocument>("Course", CourseSchema);

export default Course;