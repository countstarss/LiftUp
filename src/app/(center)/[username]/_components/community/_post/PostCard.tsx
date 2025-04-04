"use client";

import { useState, useEffect } from "react";
import { Post as PostType } from "@/types/mongo/post";
import { CommentSection } from "../CommentSection";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { getUserById } from "@/lib/auth/user";
import { User } from "@prisma/client";
import CommentItem from "../CommentItem";

export function PostCard({ post }: { post: PostType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authorData, setAuthorData] = useState<User | null>(null);

  useEffect(() => {
    getUserById(post.authorId)
      .then(user => setAuthorData(user))
      .catch(error => {
        console.error("Error fetching author:", error);
      });
  }, [post.authorId]);



  return (
    <>
      <div className="space-y-4">
        {/* Post Content */}
        <div className="space-y-2">
          <CommentSection postId={post._id} />

          {post.comments.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-primary flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <ChevronDown className="h-4 w-4" />
              <span>View all {post.comments.length} comments</span>
            </Button>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}
          // MARK: - PostDialog
        >
          <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{post.title}</DialogTitle>
            </DialogHeader>

            <div className="flex-1 scrollbar-hide overflow-y-auto">
              <div className="space-y-4">
                {/* Post Media */}
                {post.media && (
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={post.media[0] || '/images/SoranoItaly.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={authorData?.avatarUrl || 'https://avatar.vercel.sh/luke'} />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{authorData?.email || 'luke'}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
                {/* Comments Section */}
                <div className="pt-4 border border-gray-200 rounded-lg px-2">
                  <h3 className="font-medium mb-4">All Comments</h3>
                   <div className="space-y-4 p-2">
                    {post.comments.map((comment, index) => (
                      <CommentItem key={index} comment={comment} />
                    ))}
                   </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
} 