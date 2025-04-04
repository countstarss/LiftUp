import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    content: {
        type: {
            type: String,
            enum: ['text', 'audio'],
            required: true
        },
        value: { type: String, required: true },
        duration: Number
    },
    user: {
        name: { type: String, required: true },
        avatar: String
    },
    likes: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    rootId: { type: mongoose.Schema.Types.ObjectId, default: null },
    replyToUser: {
        id: String,
        name: String
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export interface CommentDocument extends mongoose.Document {
    userId: string;
    courseId: string;
    chapterId: string;
    content: {
        type: 'text' | 'audio';
        value: string;
        duration?: number;
    };
    user: {
        name: string;
        avatar: string;
    };
    likes: number;
    parentId: mongoose.Types.ObjectId | null;
    rootId: mongoose.Types.ObjectId | null;
    replyToUser?: {
        id: string;
        name: string;
    };
    replies: CommentDocument[];
    createdAt: Date;
    updatedAt: Date;
}