import { NextResponse } from 'next/server';
import { getProduct } from '../../../lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: '유효하지 않은 제품 ID입니다.' }, { status: 400 });
    }
    
    const product = await getProduct(id);
    if (!product) {
      return NextResponse.json({ error: '해당 ID의 제품을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('제품 조회 오류:', error);
    return NextResponse.json({ error: '제품을 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}