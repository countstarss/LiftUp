"use client";
import React, { useState } from "react";
import UserHeader from "./UserHeader";
import MainContent from "./MainContent";

export default function ProfilePage() {
    const [coverImage, setCoverImage] = useState<string>("/images/SoranoItaly.jpg");
    return (
        <div className="flex flex-col min-h-screen max-w-[4xl] mx-auto px-4">
            <UserHeader coverImage={coverImage} onCoverImageChange={setCoverImage} />
            <MainContent />
        </div>
    );
}