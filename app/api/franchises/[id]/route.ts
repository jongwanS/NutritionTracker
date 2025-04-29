import { storage } from '../../../../server/storage';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: '유효하지 않은 프랜차이즈 ID입니다.' }, { status: 400 });
    }
    
    const franchise = await storage.getFranchise(id);
    if (!franchise) {
      return NextResponse.json({ error: '해당 ID의 프랜차이즈를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(franchise);
  } catch (error) {
    console.error('프랜차이즈 조회 오류:', error);
    return NextResponse.json({ error: '프랜차이즈를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}