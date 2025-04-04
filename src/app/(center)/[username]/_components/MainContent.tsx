"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, Playlist, Post } from "@/types/profile";
import PostEditor from './community/PostEditor';
import { postService } from '@/app/server-actions/post.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import ThemeSlider from './home/ThemeSlider';
import KanbanBoard from './kanban/KanbanBoard';
import { mockThemes } from '@/data/mockData';
import PlaylistContent from "./tab-contents/playlist-content";
import AboutContent from "./tab-contents/about-content";
import CommunityContent from "./tab-contents/community-content";
import TabListScroll from "./community/TabListScroll";



const MainContent = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
    const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
    // const [posts, setPosts] = useState<Post[]>([]);
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>();
    // const { toast } = useToast();
    const queryClient = useQueryClient();

    const [themes, setThemes] = useState(mockThemes);

    // MARK: 获取帖子列表
    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: postService.getPosts,
    });

    // MARK: 创建帖子
    const createPostMutation = useMutation({
        mutationFn: postService.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post created successfully');
            setIsPostEditorOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message as string);
        },
    });

    // MARK: 更新帖子
    const updatePostMutation = useMutation({
        mutationFn: (updatedPost: Partial<Post>) => {
            if (!updatedPost._id) throw new Error('Post ID is required');
            return postService.updatePost(updatedPost._id, updatedPost);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post updated successfully');
            setIsPostEditorOpen(false);
            setEditingPost(undefined);
        },
        onError: (error: any) => {
            toast.error(error.message as string);
        },
    });

    // MARK: 创建新的 Playlist
    const handleCreatePlaylist = () => {
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            title: newPlaylistTitle,
            description: newPlaylistDesc,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: []
        };

        // NOTE: 添加到对应分类中
        setCategories(prev => [...prev, {
            id: Date.now().toString(),
            title: "New Category",
            description: "Category description",
            items: [newPlaylist]
        }]);
    };

    // MARK: 渲染内容卡片
    const renderContentCard = (item: Playlist | Post) => {
        return (
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>By Author</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        );
    };

    // MARK: 创建帖子
    const handleCreatePost = (newPost: Partial<Post>) => {
        createPostMutation.mutate(newPost);
    };



    // MARK: 编辑帖子
    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setIsPostEditorOpen(true);
    };



    // MARK: 更新帖子
    const handleUpdatePost = (updatedPost: Partial<Post>) => {
        // 确保有 ID
        if (!editingPost?._id) {
            toast.error('Post ID is missing');
            return;
        }

        // 合并原有帖子数据和更新的数据
        const mergedPost = {
            ...editingPost,
            ...updatedPost,
            _id: editingPost._id,
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
                            <TabsTrigger value="videos">Videos</TabsTrigger>
                            <TabsTrigger value="playlists">Playlists</TabsTrigger>
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
                    <TabsContent value="home" className="h-full "
                    // MARK: Home
                    >
                        {
                            themes.map((theme) => (
                                <ThemeSlider key={theme.id} theme={theme} />
                            ))
                        }
                    </TabsContent>

                    <TabsContent value="playlists" className="p-6 mb-[300px]"
                    // MARK: Playlists
                    >
                        <PlaylistContent
                            categories={categories}
                            newPlaylistTitle={newPlaylistTitle}
                            setNewPlaylistTitle={setNewPlaylistTitle}
                            newPlaylistDesc={newPlaylistDesc}
                            setNewPlaylistDesc={setNewPlaylistDesc}
                            handleCreatePlaylist={handleCreatePlaylist}
                            renderContentCard={renderContentCard}
                        />
                    </TabsContent>

                    <TabsContent value="community" className="p-6 mb-[300px]"
                    // MARK: Community
                    >
                        <CommunityContent
                            posts={posts}
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