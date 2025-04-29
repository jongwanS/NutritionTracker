import { storage } from '../../../server/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const franchises = await storage.getFranchises();
    return NextResponse.json(franchises);
  } catch (error) {
    console.error('프랜차이즈 조회 오류:', error);
    return NextResponse.json({ error: '프랜차이즈를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}