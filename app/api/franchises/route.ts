import { storage } from '../../../server/storage';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
    
    if (categoryId) {
      // 특정 카테고리에 속한 프랜차이즈 조회
      const franchises = await storage.getFranchisesByCategory(categoryId);
      return NextResponse.json(franchises);
    } else {
      // 모든 프랜차이즈 조회
      const franchises = await storage.getFranchises();
      return NextResponse.json(franchises);
    }
  } catch (error) {
    console.error('프랜차이즈 조회 오류:', error);
    return NextResponse.json({ error: '프랜차이즈를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}