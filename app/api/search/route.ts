import { NextResponse } from 'next/server';
import { searchProducts } from '../../lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 검색 파라미터 추출
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const franchiseId = searchParams.get('franchiseId') ? parseInt(searchParams.get('franchiseId')!) : undefined;
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
    const calorieRange = searchParams.get('calorieRange') || undefined;
    const proteinRange = searchParams.get('proteinRange') || undefined;
    const carbsRange = searchParams.get('carbsRange') || undefined;
    const fatRange = searchParams.get('fatRange') || undefined;
    
    // 검색 파라미터 객체 생성
    const params: any = {
      query,
      franchiseId,
      categoryId,
      calorieRange,
      proteinRange,
      carbsRange,
      fatRange
    };
    
    // 디버깅을 위한 로그
    console.log("Search API called with params:", Object.fromEntries(searchParams.entries()));
    console.log("Parsed search params:", params);
    console.log("Original URL 쿼리 파라미터:", request.url);
    
    // 검색 실행
    const products = await searchProducts(params);
    
    // 검색 결과 반환
    return NextResponse.json(products);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 });
  }
}