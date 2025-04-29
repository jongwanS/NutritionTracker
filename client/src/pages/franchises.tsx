import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterBar } from "@/components/ui/filter-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FranchiseGrid } from "@/components/franchise-grid";
import { Skeleton } from "@/components/ui/skeleton";


interface FranchisesProps {
  params: {
    categoryId: string;
  };
}

export default function Franchises({ params }: FranchisesProps) {
  const categoryId = parseInt(params.categoryId);
  
  // Fetch the category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['/api/categories', categoryId],
    queryFn: () => fetch(`/api/categories/${categoryId}`).then(res => res.json()),
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Prepare breadcrumb items
  const breadcrumbItems = [
    {
      label: categoryLoading ? "로딩 중..." : category?.nameKorean || "카테고리",
      path: `/category/${categoryId}`,
      current: true
    }
  ];
  
  return (
    <>
      <FilterBar />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <h1 className="text-3xl font-heading font-bold mb-6">
        {categoryLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <>{category?.nameKorean || "카테고리"} 프랜차이즈</>
        )}
      </h1>
      
      <FranchiseGrid categoryId={categoryId} />
    </>
  );
}
