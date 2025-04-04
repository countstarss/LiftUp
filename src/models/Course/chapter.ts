import { Schema } from "mongoose";
import { DialogDocument, DialogSchema,  } from "./dialog";
import { ReadingDocument, ReadingSchema } from "./reading";
import { QuestionDocument, QuestionSchema } from "./question";

// Chapter Schema
export const ChapterSchema = new Schema(
    {
        title: { type: String, required: false },
        description: { type: String },
        image: { type: String },
        duration: { type: Number },
        dialogs: {
            type: [DialogSchema],
            default: [], // 默认值为一个空数组
        },
        readings: {
            type: [ReadingSchema],
            default: [], // 默认值为一个空数组
        },
        questions: {
            type: [QuestionSchema],
            default: [], // 默认值为一个空数组
        },
    }
);

// Chapter Interface
export interface ChapterDocument extends Document {
    title: string;
    description?: string;
    image?: string;
    duration?: number;
    dialogs?: DialogDocument[]; // 子文档类型为数组
    readings?: ReadingDocument[]; // 子文档类型为数组
    questions?: QuestionDocument[]; // 子文档类型为数组
}

// Chapter Model
// const Chapter: Model<ChapterDocument> =
//     mongoose.models.Chapter || mongoose.model<ChapterDocument>("Chapter", ChapterSchema);

// export default Chapter;