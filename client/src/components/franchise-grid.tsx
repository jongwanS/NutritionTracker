import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Franchise } from "@/types";
import { Store, ArrowRightCircle } from "lucide-react";

interface FranchiseGridProps {
  categoryId: number;
}

export function FranchiseGrid({ categoryId }: FranchiseGridProps) {
  const [, navigate] = useLocation();
  
  // Fetch franchises by category
  const { data: franchises, isLoading, error } = useQuery({
    queryKey: ['/api/franchises', { categoryId }],
    queryFn: async () => {
      const response = await fetch(`/api/franchises?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch franchises');
      }
      return response.json();
    },
  });
  
  const handleFranchiseSelect = (franchiseId: number) => {
    navigate(`/franchise/${franchiseId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="aspect-square">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
        <p className="text-primary mb-2 font-semibold">프랜차이즈 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  if (franchises?.length === 0) {
    return (
      <div className="text-center py-10 bg-pink-50/50 rounded-lg p-8">
        <Store className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600 mb-2">이 카테고리에 등록된 프랜차이즈가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {franchises?.map((franchise: Franchise) => (
        <div 
          key={franchise.id}
          className="aspect-square rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100 bg-white cursor-pointer"
          onClick={() => handleFranchiseSelect(franchise.id)}
        >
          <div className="h-full w-full flex flex-col items-center justify-center p-3 relative">
            <div className="absolute top-2 right-2">
              <ArrowRightCircle className="h-4 w-4 text-primary opacity-70" />
            </div>
            <div className="flex-grow flex items-center justify-center">
              <h3 className="text-base font-heading font-semibold text-pink-700 text-center">
                {franchise.id === 72 ? "HY 잇츠온" : 
                 franchise.id === 73 ? "신세계푸드 피코크" : 
                 franchise.id === 27 ? "7번가피자" : 
                 franchise.id === 28 ? "피자나라치킨공주" : 
                 franchise.name}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
