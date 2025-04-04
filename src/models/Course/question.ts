import { Schema, Document } from "mongoose";

// QuestionOption Schema（嵌套在 QuestionSchema 中）
const QuestionOptionSchema = new Schema(
    {
        type: { type: String, enum: ['text', 'image'], required: true },
        content: { type: String, required: true },
    },
    { _id: false } // 不为子文档生成独立的 `_id`
);

// Question Schema
export const QuestionSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'listening-choice'],
            required: true,
        },
        question: { type: String, required: true },
        audioLink: { type: String }, // 可选字段
        options: { type: [QuestionOptionSchema], default: [] }, // 嵌套 QuestionOptionSchema
        correctAnswer: { type: String, required: true },
    }
);

// TypeScript 文档类型定义
export interface QuestionOption {
    type: 'text' | 'image';
    content: string;
}

export interface QuestionDocument extends Document {
    type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank' | 'listening-choice';
    question: string;
    audioLink?: string;
    options?: QuestionOption[];
    correctAnswer: string;
}

// Mongoose 模型定义
// const Question: Model<QuestionDocument> =
//     mongoose.models.Question || mongoose.model<QuestionDocument>("Question", QuestionSchema);

// export default Question;