"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostEditor from './community/PostEditor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import KanbanBoard from './kanban/KanbanBoard';
import AboutContent from "./tab-contents/about-content";
import CommunityContent from "./tab-contents/community-content";
import TabListScroll from "./community/TabListScroll";
import { Post, User, Comment } from "@prisma/client";
import { getPosts, createPost, updatePost } from '@/app/api/posts/service';

// 定义扩展的Post类型，包含关联数据
type PostWithRelations = Post & {
  owner?: User;
  comments?: CommentWithUser[];
  _count?: {
    comments?: number;
  };
  // 用于媒体展示
  media?: string[];
};

type CommentWithUser = Comment & {
  owner?: User;
};

const MainContent = () => {

    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostWithRelations | undefined>();
    const queryClient = useQueryClient();

    // MARK: 获取帖子列表
    const { data: posts = [], isLoading } = useQuery<PostWithRelations[]>({
        queryKey: ['posts'],
        queryFn: () => getPosts({
            limit: 10,
            offset: 0,
            userId: '1',
            actionId: '1',
        }),
    });

    // 使用isLoading状态
    useEffect(() => {
        if (isLoading) {
            console.log("正在加载帖子数据...");
        } else {
            console.log(`已加载 ${posts.length} 条帖子`);
        }
    }, [isLoading, posts.length]);

    // MARK: 创建帖子
    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('帖子创建成功');
            setIsPostEditorOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // MARK: 更新帖子
    const updatePostMutation = useMutation({
        mutationFn: (updatedPost: Partial<PostWithRelations>) => {
            if (!updatedPost.id) throw new Error('帖子ID是必需的');
            return updatePost(updatedPost.id, updatedPost);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('帖子更新成功');
            setIsPostEditorOpen(false);
            setEditingPost(undefined);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });


    // MARK: 创建帖子
    const handleCreatePost = (newPost: Partial<Post>) => {
        createPostMutation.mutate(newPost);
    };



    // MARK: 编辑帖子
    const handleEditPost = (post: PostWithRelations) => {
        setEditingPost(post);
        setIsPostEditorOpen(true);
    };



    // MARK: 更新帖子
    const handleUpdatePost = (updatedPost: Partial<PostWithRelations>) => {
        // 确保有 ID
        if (!editingPost?.id) {
            toast.error('帖子ID缺失');
            return;
        }

        // 合并原有帖子数据和更新的数据
        const mergedPost = {
            ...editingPost,
            ...updatedPost,
            id: editingPost.id,
        };

        updatePostMutation.mutate(mergedPost);
    };



    return (
        <div className="flex-1">
            <Tabs defaultValue="home" className="w-full relative">
                {/* 标签栏 */}
                <div className="sticky top-0 z-50 backdrop-blur border-b w-full my-2">
                    <TabListScroll>
                        <TabsList className="justify-start gap-4 w-max">
                            <TabsTrigger value="home">Home</TabsTrigger>
                            <TabsTrigger value="community">Community</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="kanban">Kanban</TabsTrigger>
                            {/* 添加更多标签以测试滚动 */}
                            <TabsTrigger value="extra1">Extra Tab 1</TabsTrigger>
                            <TabsTrigger value="extra2">Extra Tab 2</TabsTrigger>
                            <TabsTrigger value="extra3">Extra Tab 3</TabsTrigger>
                        </TabsList>
                    </TabListScroll>
                </div>

                {/* 内容区域 */}
                <div className="py-6 sticky top-[200px]">

                    <TabsContent value="community" className="p-6 mb-[300px]"
                    // MARK: Community
                    >
                        <CommunityContent
                            posts={posts as PostWithRelations[]}
                            handleEditPost={handleEditPost}
                            setEditingPost={setEditingPost}
                            setIsPostEditorOpen={setIsPostEditorOpen}
                        />

                        <PostEditor
                            post={editingPost}
                            isOpen={isPostEditorOpen}
                            onClose={() => {
                                setIsPostEditorOpen(false);
                                setEditingPost(undefined);
                            }}
                            onSave={editingPost ? handleUpdatePost : handleCreatePost}
                        />
                    </TabsContent>

                    <TabsContent value="about" className="p-6 mb-[300px]"
                    // MARK: About
                    >
                        <AboutContent />
                    </TabsContent>

                    <TabsContent value="kanban" className="px-6 mb-[200px] sticky top-[200px]"
                    // MARK: Kanban
                    >
                        <KanbanBoard />
                    </TabsContent>
                </div>
            </Tabs>
        </div >
    );
};

export default MainContent;