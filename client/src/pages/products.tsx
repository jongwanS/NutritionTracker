import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterBar } from "@/components/ui/filter-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductList } from "@/components/product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerAd, ResponsiveAd } from "@/components/ui/advertisement";
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
  
  // URL에서 필터 파라미터 추출
  const calorieRange = searchParams.get("calorieRange") || "0";
  const proteinRange = searchParams.get("proteinRange") || "0";
  const carbsRange = searchParams.get("carbsRange") || "0";
  const fatRange = searchParams.get("fatRange") || "0";
  
  // URL 파라미터 변경 감지 및 처리
  useEffect(() => {
    console.log("Products 페이지: URL 파라미터 변경 감지:", {
      franchiseId,
      calorieRange,
      proteinRange,
      carbsRange,
      fatRange,
      url: window.location.href
    });
    
    // URL 파라미터가 있으면 자동으로 필터 적용
    if (calorieRange !== "0" || proteinRange !== "0" || carbsRange !== "0" || fatRange !== "0") {
      console.log("URL에 필터 파라미터가 있어 쿼리 무효화");
      // 기존 필터 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['/api/products', { franchiseId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/search'] });
      
      // 필터 변경 콜백 호출하여 필터 적용
      handleFilterChange();
    }
  }, [searchParams]); // searchParams 변경 시 호출되도록 의존성 배열 업데이트
  
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
  
  // 필터 변경 시 제품 쿼리 무효화 처리
  const handleFilterChange = () => {
    // 제품 쿼리와 검색 쿼리 모두 무효화하여 새로운 필터로 다시 로드하게 함
    queryClient.invalidateQueries({ queryKey: ['/api/products', { franchiseId }] });
    queryClient.invalidateQueries({ queryKey: ['/api/search'] });
    
    console.log("필터 변경됨: 제품 및 검색 쿼리 무효화");
  };
  
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
  
  breadcrumbItems.push({
    label: franchiseLoading ? "로딩 중..." : franchise?.name || "프랜차이즈",
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
          <>{franchise?.name || "프랜차이즈"} 메뉴</>
        )}
      </h1>
      
      {/* 제품 목록 위 광고 배너 */}
      <BannerAd className="my-4" />
      
      {/* URL 파라미터를 명시적으로 초기 필터로 전달 */}
      <ProductList 
        franchiseId={franchiseId} 
        initialFilters={{
          calorieRange,
          proteinRange,
          carbsRange,
          fatRange
        }}
      />
      
      {/* 제품 목록 아래 반응형 광고 */}
      <div className="mt-10">
        <ResponsiveAd />
      </div>
    </>
  );
}
