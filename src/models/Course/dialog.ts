import { Schema } from "mongoose";

// Dialog Schema
export const DialogSchema = new Schema({
    speaker: { type: String, enum: ["speaker1", "speaker2"], required: true },
    translation: {
        pinyin: { type: String, required: true },
        chinese: { type: String, required: true },
        english: { type: String, required: true },
    },
    audioLink: { type: String, required: true },
});

// Dialog Document Interface
export interface DialogDocument extends Document {
    speaker: "speaker1" | "speaker2";
    translation: {
        pinyin: string;
        chinese: string;
        english: string;
    };
    audioLink: string;
}

// 使用 mongoose.models 避免重复注册模型
// const DialogModel: Model<DialogDocument> =
//     mongoose.models.Dialog || mongoose.model<DialogDocument>("Dialog", DialogSchema);

// export default DialogModel;