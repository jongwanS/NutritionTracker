import { storage } from '../../../../server/storage';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }
    
    const category = await storage.getCategory(id);
    if (!category) {
      return NextResponse.json({ error: '해당 ID의 카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return NextResponse.json({ error: '카테고리를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}