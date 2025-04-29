import { storage } from '../../../server/storage';
import { NextResponse } from 'next/server';
import { ProductSearchParams } from '../../../shared/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
    const franchiseId = searchParams.get('franchiseId') ? parseInt(searchParams.get('franchiseId')!) : undefined;
    
    // 영양성분 필터 파싱
    const calorieRange = searchParams.get('calorieRange') || '0';
    const proteinRange = searchParams.get('proteinRange') || '0';
    const carbsRange = searchParams.get('carbsRange') || '0';
    const fatRange = searchParams.get('fatRange') || '0';
    
    const nutritionalFilter = {
      calorieRange,
      proteinRange,
      carbsRange,
      fatRange
    };
    
    const searchParams2: ProductSearchParams = {
      query: query || undefined,
      categoryId,
      franchiseId,
      nutritionalFilter
    };
    
    const products = await storage.searchProducts(searchParams2);
    return NextResponse.json(products);
  } catch (error) {
    console.error('제품 검색 오류:', error);
    return NextResponse.json({ error: '제품 검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
}