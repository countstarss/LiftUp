import { Avatar } from '@/components/ui/avatar';
import { Comment } from '@/types/mongo/post';
import React from 'react';

interface CommentItemProps {
    // You can define any props needed here
    comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {


    return (
        <div className="flex items-start gap-2">
            <Avatar className="w-6 h-6">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                    {comment.userName[0]}
                </div>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm font-medium">{comment.userName}</p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default CommentItem;