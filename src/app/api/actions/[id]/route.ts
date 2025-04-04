import { NextRequest, NextResponse } from 'next/server';
import { actions } from '@/lib/data/actions';

export async function GET(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const action = actions.find(action => action.id === id);

    if (!action) {
      return NextResponse.json({
        message: '未找到指定的行动建议',
        success: false,
      }, { status: 404 });
    }

    return NextResponse.json({
      message: '获取行动建议成功',
      success: true,
      data: action
    });
  } catch (error) {
    console.error('获取行动建议详情失败:', error);
    return NextResponse.json({
      message: '获取行动建议详情时发生错误',
      success: false,
    }, { status: 500 });
  }
}