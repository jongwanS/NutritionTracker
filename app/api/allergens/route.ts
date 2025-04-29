import { NextResponse } from 'next/server';
import { getAllergens } from '../../lib/data';

export async function GET() {
  try {
    const allergens = await getAllergens();
    return NextResponse.json(allergens);
  } catch (error) {
    console.error('알러젠 조회 오류:', error);
    return NextResponse.json({ error: '알러젠 정보를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}