import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterBar } from "@/components/ui/filter-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductList } from "@/components/product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerAd, ResponsiveAd } from "@/components/ui/advertisement";

interface ProductsProps {
  params: {
    franchiseId: string;
  };
}

export default function Products({ params }: ProductsProps) {
  const franchiseId = parseInt(params.franchiseId);
  const queryClient = useQueryClient();
  
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
    // 제품 쿼리를 무효화하여 새로운 필터로 다시 로드하게 함
    queryClient.invalidateQueries({ queryKey: ['/api/products', { franchiseId }] });
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
      
      <ProductList franchiseId={franchiseId} />
      
      {/* 제품 목록 아래 반응형 광고 */}
      <div className="mt-10">
        <ResponsiveAd />
      </div>
    </>
  );
}
