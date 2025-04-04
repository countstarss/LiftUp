import { NextResponse } from 'next/server';
import { actions } from '@/lib/data/actions';

// MARK: 获取所有行动建议列表，支持筛选
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

    return NextResponse.json({
      message: '获取行动建议列表成功',
      success: true,
      data: filteredActions
    });
  } catch (error) {
    console.error('获取行动建议列表失败:', error);
    return NextResponse.json({
      message: '获取行动建议列表时发生错误',
      success: false,
    }, { status: 500 });
  }
} 