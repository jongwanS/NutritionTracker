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
    
    // 범위 값을 기반으로 min/max 값 설정 (임시 변환)
    // 나중에 실제 schema.ts에 맞게 정확히 수정 필요
    const [minCalories, maxCalories] = calorieRange !== '0' ? [0, parseInt(calorieRange)] : [undefined, undefined];
    const [minProtein, maxProtein] = proteinRange !== '0' ? [parseInt(proteinRange), undefined] : [undefined, undefined];
    const [minCarbs, maxCarbs] = carbsRange !== '0' ? [0, parseInt(carbsRange)] : [undefined, undefined];
    const [minFat, maxFat] = fatRange !== '0' ? [0, parseInt(fatRange)] : [undefined, undefined];
    
    const searchParams2: ProductSearchParams = {
      query: query || undefined,
      categoryId,
      franchiseId,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      minCarbs,
      maxCarbs,
      minFat,
      maxFat
    };
    
    const products = await storage.searchProducts(searchParams2);
    return NextResponse.json(products);
  } catch (error) {
    console.error('제품 검색 오류:', error);
    return NextResponse.json({ error: '제품 검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
}