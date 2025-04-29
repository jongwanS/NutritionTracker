import { NextResponse } from 'next/server';
import { getAllergen } from '../../../lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: '잘못된 알러젠 ID입니다.' }, { status: 400 });
    }
    
    const allergen = await getAllergen(id);
    
    if (!allergen) {
      return NextResponse.json({ error: '알러젠 정보를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(allergen);
  } catch (error) {
    console.error('알러젠 조회 오류:', error);
    return NextResponse.json({ error: '알러젠 정보를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}