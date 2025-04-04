import { NextResponse } from 'next/server';
import { actions } from '@/lib/data/actions';

// MARK: 获取随机行动建议
export async function GET(request: Request) {
  try {
    // 获取URL查询参数
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const location = url.searchParams.get('location');
    const equipment = url.searchParams.get('equipment');
    const energy = url.searchParams.get('energy');
    const maxDuration = url.searchParams.get('maxDuration') ? 
      parseInt(url.searchParams.get('maxDuration') as string) : undefined;

    // 筛选符合条件的行动
    let filteredActions = [...actions];
    
    if (type) {
      filteredActions = filteredActions.filter(action => action.type === type);
    }
    
    if (location) {
      filteredActions = filteredActions.filter(action => action.location === location);
    }
    
    if (equipment) {
      filteredActions = filteredActions.filter(action => action.equipment === equipment);
    }
    
    if (energy) {
      filteredActions = filteredActions.filter(action => action.energy === energy);
    }
    
    if (maxDuration) {
      filteredActions = filteredActions.filter(action => 
        action.duration && action.duration <= maxDuration
      );
    }

    // 只获取活跃的行动
    filteredActions = filteredActions.filter(action => action.energy);

    if (filteredActions.length === 0) {
      return NextResponse.json({
        message: '没有找到符合条件的行动建议',
        success: false,
      }, { status: 404 });
    }

    // 随机选择一个行动
    const randomIndex = Math.floor(Math.random() * filteredActions.length);
    const randomAction = filteredActions[randomIndex];

    return NextResponse.json({
      message: '获取随机行动建议成功',
      success: true,
      data: randomAction
    });
  } catch (error) {
    console.error('获取随机行动建议失败:', error);
    return NextResponse.json({
      message: '获取随机行动建议时发生错误',
      success: false,
    }, { status: 500 });
  }
} 