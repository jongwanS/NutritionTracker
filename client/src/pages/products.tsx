import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterBar } from "@/components/ui/filter-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductList } from "@/components/product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { useSearchParams } from "@/hooks/use-search-params";

interface ProductsProps {
  params: {
    franchiseId: string;
  };
}

export default function Products({ params }: ProductsProps) {
  const franchiseId = parseInt(params.franchiseId);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  // URL에서 필터 파라미터 추출
  const calorieRange = searchParams.get("calorieRange") || "0";
  const proteinRange = searchParams.get("proteinRange") || "0";
  const carbsRange = searchParams.get("carbsRange") || "0";
  const fatRange = searchParams.get("fatRange") || "0";

  // 현재 활성화된 필터들을 상태로 관리
  const [activeFilters, setActiveFilters] = useState({
    calorieRange,
    proteinRange,
    carbsRange,
    fatRange
  });
  
  // Fetch franchise details
  const { data: franchise, isLoading: franchiseLoading } = useQuery({
    queryKey: ['/api/franchises', franchiseId],
    queryFn: () => fetch(`/api/franchises/${franchiseId}`).then(res => res.json()),
  });
  
  // Fetch category for breadcrumbs if franchise is loaded
  const { data: category } = useQuery({
    queryKey: ['/api/categories', franchise?.categoryId],
    queryFn: () => fetch(`/api/categories/${franchise.categoryId}`).then(res => res.json()),
    enabled: !!franchise?.categoryId,
  });
  
  // Fetch products for this franchise
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/search', { franchiseId }],
    queryFn: async () => {
      const res = await fetch(`/api/search?franchiseId=${franchiseId}`);
      if (!res.ok) {
        console.error('제품 로드 오류:', res.status);
        return [];
      }
      return res.json();
    }
  });
  
  // 필터 변경 시 클라이언트 측에서 필터링 로직 적용
  const handleFilterChange = useCallback((newFilters: any) => {
    console.log("필터 변경됨:", newFilters);
    setActiveFilters(newFilters);
  }, []);
  
  // 필터에 따라 제품 필터링 적용
  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
    console.log(`브랜드 상세 - 필터링 전 제품 수: ${products.length}`);
    let filtered = [...products];
    
    // 칼로리 필터 적용 (이하)
    if (activeFilters.calorieRange && parseInt(activeFilters.calorieRange) > 0) {
      filtered = filtered.filter(p => 
        p.calories !== null && p.calories <= parseInt(activeFilters.calorieRange)
      );
      console.log(`칼로리 필터 (${activeFilters.calorieRange}kcal 이하) 적용 후: ${filtered.length}개`);
    }
    
    // 단백질 필터 적용 (이상)
    if (activeFilters.proteinRange && parseInt(activeFilters.proteinRange) > 0) {
      filtered = filtered.filter(p => 
        p.protein !== null && p.protein >= parseInt(activeFilters.proteinRange)
      );
      console.log(`단백질 필터 (${activeFilters.proteinRange}g 이상) 적용 후: ${filtered.length}개`);
    }
    
    // 탄수화물 필터 적용 (이하)
    if (activeFilters.carbsRange && parseInt(activeFilters.carbsRange) > 0) {
      filtered = filtered.filter(p => 
        p.carbs !== null && p.carbs <= parseInt(activeFilters.carbsRange)
      );
      console.log(`탄수화물 필터 (${activeFilters.carbsRange}g 이하) 적용 후: ${filtered.length}개`);
    }
    
    // 지방 필터 적용 (이하)
    if (activeFilters.fatRange && parseInt(activeFilters.fatRange) > 0) {
      filtered = filtered.filter(p => 
        p.fat !== null && p.fat <= parseInt(activeFilters.fatRange)
      );
      console.log(`지방 필터 (${activeFilters.fatRange}g 이하) 적용 후: ${filtered.length}개`);
    }
    
    console.log(`브랜드 상세 - 최종 필터링 결과: ${filtered.length}개 제품`);
    setFilteredProducts(filtered);
  }, [products, activeFilters]);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Prepare breadcrumb items
  const breadcrumbItems = [];
  
  if (category) {
    breadcrumbItems.push({
      label: category.nameKorean,
      path: `/category/${category.id}`,
      current: false
    });
  }
  
  // 특별 처리: 프랜차이즈 ID에 따른 이름 매핑 (데이터 오류 수정)
  let franchiseName = franchiseLoading ? "로딩 중..." : franchise?.name || "프랜차이즈";
  if (franchiseId === 72) {
    franchiseName = "HY 잇츠온";
  } else if (franchiseId === 73) {
    franchiseName = "신세계푸드 피코크";
  } else if (franchiseId === 27) {
    franchiseName = "7번가피자";
  } else if (franchiseId === 28) {
    franchiseName = "피자나라치킨공주";
  }
  
  breadcrumbItems.push({
    label: franchiseName,
    path: `/franchise/${franchiseId}`,
    current: true
  });
  
  return (
    <>
      <FilterBar onFilterChange={handleFilterChange} />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <h1 className="text-3xl font-heading font-bold mb-6">
        {franchiseLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <>{franchiseName} 메뉴</>
        )}
      </h1>
      
      {/* 필터링된 제품 목록 전달 */}
      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ProductList 
          franchiseId={franchiseId} 
          initialFilters={{
            calorieRange,
            proteinRange,
            carbsRange,
            fatRange
          }}
          products={filteredProducts} // 필터링된 제품 전달
        />
      )}
      

    </>
  );
}
