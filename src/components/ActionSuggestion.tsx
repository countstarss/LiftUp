'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';

// Action类型定义
interface Action {
  id: string;
  description: string;
  type?: string;
  locationRequirement?: string;
  equipmentNeeded?: string;
  estimatedDurationMinutes?: number;
  energyLevelRequired?: string;
}

const ActionSuggestion = () => {
  // 状态
  const [type, setType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [maxDuration, setMaxDuration] = useState<number>(60);
  const [energy, setEnergy] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取随机行动建议
  const getRandomAction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建URL参数
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (location) params.append('location', location);
      if (energy) params.append('energy', energy);
      params.append('maxDuration', maxDuration.toString());
      
      // 调用API
      const response = await fetch(`/api/actions/random?${params.toString()}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || '获取行动建议失败');
      }
      
      setAction(result.data);
    } catch (err: any) {
      setError(err.message || '获取行动建议时发生错误');
      setAction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 筛选区域 */}
      <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">筛选条件</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">活动类型</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="选择活动类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                <SelectItem value="indoor">室内活动</SelectItem>
                <SelectItem value="outdoor">户外活动</SelectItem>
                <SelectItem value="creative">创意活动</SelectItem>
                <SelectItem value="social">社交活动</SelectItem>
                <SelectItem value="quick_win">快速成就</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">地点要求</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="选择地点" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">任意地点</SelectItem>
                <SelectItem value="home">家里</SelectItem>
                <SelectItem value="outside">户外</SelectItem>
                <SelectItem value="anywhere">任何地方</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="energy">精力水平</Label>
            <Select value={energy} onValueChange={setEnergy}>
              <SelectTrigger id="energy">
                <SelectValue placeholder="选择精力水平" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">任意</SelectItem>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="high">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="duration">最长时间</Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{maxDuration} 分钟</span>
            </div>
            <Slider
              id="duration"
              min={10}
              max={180}
              step={5}
              value={[maxDuration]}
              onValueChange={(value: number[]) => setMaxDuration(value[0])}
              className="mt-2"
            />
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={getRandomAction}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                加载中...
              </>
            ) : (
              '帮我选一个！'
            )}
          </Button>
        </div>
      </div>
      
      {/* 建议展示区域 */}
      <div className="w-full md:w-2/3">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        
        {!error && !action && !loading && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              使用左侧筛选条件，点击&#34;帮我选一个！&#34;<br />
              获取个性化行动建议
            </p>
          </div>
        )}
        
        {action && (
          <Card>
            <CardHeader>
              <CardTitle>行动建议</CardTitle>
              <CardDescription>
                {action.type && `类型: ${action.type}`}
                {action.locationRequirement && ` • 地点: ${action.locationRequirement}`}
                {action.estimatedDurationMinutes && ` • 预计时间: ${action.estimatedDurationMinutes}分钟`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{action.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={getRandomAction}>
                换一个
              </Button>
              <Button>标记为已完成</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActionSuggestion; 