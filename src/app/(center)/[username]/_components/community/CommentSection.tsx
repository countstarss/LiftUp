import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/app/server-actions/comment.service';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getComments(postId),
  });


  return (
    <div className="space-y-4">
      {comments.length > 0 && comments.map((comment, index) => (
        <CommentItem key={index} comment={comment} />
      ))}
    </div>
  );
} 