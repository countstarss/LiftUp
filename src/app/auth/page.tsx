"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 处理URL查询参数
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");
    const authParam = searchParams.get("auth");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    if (successParam) {
      setSuccess(decodeURIComponent(successParam));
    }

    if (authParam === "success") {
      setSuccess("登录成功！");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              LiftUp
            </h1>
            <p className="text-gray-600 dark:text-gray-400">让心灵放松，找回人生方向</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              variant="default"
              className="mb-6 bg-green-50 border-green-200 text-green-800"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <AuthForm />
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">心灵释放，寻找方向</h2>
            <p className="text-xl opacity-90 mb-8">
              通过科学的心理辅导和个性化指导，帮助您缓解压力，找回人生方向
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>专业减压冥想指导</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>个性化心理舒缓方案</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>生活目标规划指导</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>情绪管理与压力缓解</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>社区支持与经验分享</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>科学的方向感重建</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
