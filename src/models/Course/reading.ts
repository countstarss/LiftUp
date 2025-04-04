import { Schema, Document } from "mongoose";

// 定义 Sentences 的接口类型
interface Sentence {
    pinyin: string;
    chinese: string;
    english: string;
}

// 定义 Reading 文档的接口类型
export interface ReadingDocument extends Document {
    mainImage: string;
    mainAudio: string;
    sentences: Sentence[];
}

// Reading Schema
export const ReadingSchema = new Schema<ReadingDocument>({
    mainImage: { type: String, required: true },
    mainAudio: { type: String, required: true },
    sentences: [
        {
            pinyin: { type: String, required: true },
            chinese: { type: String, required: true },
            english: { type: String, required: true },
        },
    ],
});

// Reading 模型
// const Reading: Model<ReadingDocument> =
//     mongoose.models.Reading || mongoose.model<ReadingDocument>("Reading", ReadingSchema);

// export default Reading;