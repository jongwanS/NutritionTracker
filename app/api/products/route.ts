import { NextResponse } from 'next/server';
import { getProducts, getProductsByFranchise, searchProducts } from '../../lib/data';
import { ProductSearchParams } from '../../../shared/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const franchiseId = searchParams.get('franchiseId') ? parseInt(searchParams.get('franchiseId')!) : undefined;
    
    // 프랜차이즈 ID가 있으면 해당 프랜차이즈의 제품만 조회
    if (franchiseId) {
      const products = await getProductsByFranchise(franchiseId);
      return NextResponse.json(products);
    }
    
    // 검색 파라미터가 있으면 검색 실행
    if (searchParams.get('query') || searchParams.get('categoryId') || 
        searchParams.get('calorieRange') || searchParams.get('proteinRange') || 
        searchParams.get('carbsRange') || searchParams.get('fatRange')) {
          
      const query = searchParams.get('query') || undefined;
      const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
      const calorieRange = searchParams.get('calorieRange') || undefined;
      const proteinRange = searchParams.get('proteinRange') || undefined;
      const carbsRange = searchParams.get('carbsRange') || undefined;
      const fatRange = searchParams.get('fatRange') || undefined;
      
      const params = {
        query,
        categoryId,
        franchiseId,
        calorieRange,
        proteinRange,
        carbsRange,
        fatRange
      };
      
      const products = await searchProducts(params);
      return NextResponse.json(products);
    }
    
    // 기본적으로 모든 제품 조회
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('제품 조회 오류:', error);
    return NextResponse.json({ error: '제품 정보를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}