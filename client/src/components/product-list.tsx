import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Heart, AlertCircle, Flame } from "lucide-react";

interface ProductListProps {
  franchiseId: number;
  initialFilters?: {
    calorieRange: string;
    proteinRange: string;
    carbsRange: string;
    fatRange: string;
  };
}

export function ProductList({ franchiseId, initialFilters }: ProductListProps) {
  const [, navigate] = useLocation();
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const { toast } = useToast();
  
  // 필터 값들 직접 가져오기
  const calorieRange = initialFilters?.calorieRange || "0";
  const proteinRange = initialFilters?.proteinRange || "0";
  const carbsRange = initialFilters?.carbsRange || "0";
  const fatRange = initialFilters?.fatRange || "0";
  
  // 개발 디버깅용 로그
  useEffect(() => {
    console.log("ProductList 마운트 - 사용할 필터:", {
      franchiseId,
      calorieRange,
      proteinRange,
      carbsRange,
      fatRange
    });
  }, [franchiseId, calorieRange, proteinRange, carbsRange, fatRange]);
  
  // 로컬 스토리지에서 좋아요 상태 로드
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          if (Array.isArray(parsedFavorites)) {
            const favoriteIds = parsedFavorites.map((fav: any) => fav.id);
            setFavoriteProducts(favoriteIds);
          }
        }
      } catch (error) {
        console.error('좋아요 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    
    loadFavorites();
    
    // 스토리지 변경 이벤트 리스너
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  // Fetch products by franchise with filters
  const { data: products, isLoading, error } = useQuery({
    // 쿼리 키에 모든 파라미터를 명시적으로 포함 (queryKey 변경 시 쿼리 재실행됨)
    queryKey: ['/api/search', { franchiseId, calorieRange, proteinRange, carbsRange, fatRange }],
    queryFn: async () => {
      try {
        // API 호출을 위한 파라미터 객체 구성 (URLSearchParams 대신 직접 객체 구성)
        const params: Record<string, string> = {
          franchiseId: franchiseId.toString()
        };
        
        // 필터 값이 0이 아닌 경우에만 파라미터에 추가
        if (calorieRange && calorieRange !== "0") {
          params.calorieRange = calorieRange;
        }
        if (proteinRange && proteinRange !== "0") {
          params.proteinRange = proteinRange;
        }
        if (carbsRange && carbsRange !== "0") {
          params.carbsRange = carbsRange;
        }
        if (fatRange && fatRange !== "0") {
          params.fatRange = fatRange;
        }
        
        // URL 쿼리 파라미터로 변환
        const queryParams = new URLSearchParams(params);
        const endpoint = `/api/search?${queryParams.toString()}`;
        
        // 디버깅 로그
        console.log("API 호출:", endpoint);
        console.log("필터 상태:", { calorieRange, proteinRange, carbsRange, fatRange });
        
        // API 요청 수행
        const res = await fetch(endpoint);
        if (!res.ok) {
          console.error('API 응답 오류:', res.status, await res.text());
          return [];
        }
        
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('API 요청 오류:', err);
        return [];
      }
    },
    // 파라미터 값이 변경될 때마다 즉시 쿼리 재실행
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  
  // Fetch allergens for badges
  const { data: allergens } = useQuery({
    queryKey: ['/api/allergens'],
    queryFn: () => fetch('/api/allergens').then(res => res.json()),
  });
  
  const handleProductSelect = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // 좋아요 토글 함수
  const toggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // 상품 클릭 이벤트 전파 방지
    
    try {
      const favoritesString = localStorage.getItem('favorites');
      let favorites = [];
      
      if (favoritesString) {
        favorites = JSON.parse(favoritesString);
        if (!Array.isArray(favorites)) favorites = [];
      }
      
      const index = favorites.findIndex((item: any) => item.id === product.id);
      
      if (index >= 0) {
        // 좋아요 삭제
        favorites.splice(index, 1);
        toast({
          title: "좋아요 삭제",
          description: "목록에서 삭제되었습니다.",
          variant: "default",
        });
      } else {
        // 좋아요 추가 - 필요한 정보만 저장
        const { id, name, description, franchiseId, categoryId, calories, protein, fat, carbs } = product;
        favorites.push({ id, name, description, franchiseId, categoryId, calories, protein, fat, carbs });
        
        toast({
          title: "좋아요 추가",
          description: "목록에 추가되었습니다.",
          variant: "default",
        });
      }
      
      // 로컬스토리지에 저장
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // 좋아요 목록 상태 업데이트
      const favoriteIds = favorites.map((item: any) => item.id);
      setFavoriteProducts(favoriteIds);
      
      // 커스텀 이벤트 발생 (헤더의 카운트 업데이트를 위해)
      window.dispatchEvent(new Event('favoritesUpdated'));
      
    } catch (e) {
      console.error('좋아요 처리 중 오류 발생:', e);
      toast({
        title: "오류 발생",
        description: "좋아요 처리 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  // Get allergen names for a product
  const getAllergenNames = (allergenIds: number[]) => {
    if (!allergens || !allergenIds) return [];
    return allergenIds.map(id => allergens.find((a: any) => a.id === id)?.nameKorean).filter(Boolean);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
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
        <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3 opacity-80" />
        <p className="text-primary mb-2 font-semibold">메뉴 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  if (products?.length === 0) {
    return (
      <div className="text-center py-10 bg-pink-50/50 rounded-lg p-8">
        <Flame className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600 mb-2">선택한 필터 조건에 맞는 메뉴가 없습니다.</p>
        <p className="text-sm text-gray-500">필터 조건을 변경해 보세요.</p>
      </div>
    );
  }
  
  // 먼저 products가 배열인지 확인하고 필요한 경우 클라이언트 측에서 필터링
  let productArray = Array.isArray(products) ? products : [];
  
  // 클라이언트 측 필터링 적용 (서버 필터링이 작동하지 않을 경우를 대비)
  if (productArray.length > 0) {
    // 칼로리 필터 (이하)
    if (calorieRange && calorieRange !== "0") {
      productArray = productArray.filter(product => 
        product.calories !== null && product.calories <= parseInt(calorieRange)
      );
      console.log(`클라이언트측 칼로리 필터 적용: ${calorieRange}kcal 이하, 남은 항목: ${productArray.length}`);
    }
    
    // 단백질 필터 (이상)
    if (proteinRange && proteinRange !== "0") {
      productArray = productArray.filter(product => 
        product.protein !== null && product.protein >= parseInt(proteinRange)
      );
      console.log(`클라이언트측 단백질 필터 적용: ${proteinRange}g 이상, 남은 항목: ${productArray.length}`);
    }
    
    // 탄수화물 필터 (이하)
    if (carbsRange && carbsRange !== "0") {
      productArray = productArray.filter(product => 
        product.carbs !== null && product.carbs <= parseInt(carbsRange)
      );
      console.log(`클라이언트측 탄수화물 필터 적용: ${carbsRange}g 이하, 남은 항목: ${productArray.length}`);
    }
    
    // 지방 필터 (이하)
    if (fatRange && fatRange !== "0") {
      productArray = productArray.filter(product => 
        product.fat !== null && product.fat <= parseInt(fatRange)
      );
      console.log(`클라이언트측 지방 필터 적용: ${fatRange}g 이하, 남은 항목: ${productArray.length}`);
    }
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {productArray.map((product: Product) => (
        <div 
          key={product.id}
          className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100 cursor-pointer"
          onClick={() => handleProductSelect(product.id)}
        >
          <div className="h-full w-full flex flex-col p-3 relative">
            {/* 좋아요 버튼 */}
            <Button
              variant="ghost" 
              size="icon"
              className={`absolute top-0 right-0 h-7 w-7 p-0 ${
                favoriteProducts.includes(product.id) 
                  ? 'text-pink-500' 
                  : 'text-gray-400 hover:text-pink-400'
              }`}
              onClick={(e) => toggleFavorite(e, product)}
            >
              <Heart className={`h-5 w-5 ${favoriteProducts.includes(product.id) ? 'fill-current' : ''}`} />
            </Button>

            {/* 제품 이름 영역 */}
            <div className="mb-2 text-center">
              <h3 className="text-base font-heading font-semibold gradient-text line-clamp-2">{product.name}</h3>
              {product.featuredProduct && (
                <div className="inline-flex mt-1 bg-pink-500/90 text-white text-xs py-0.5 px-1.5 rounded-full shadow-sm items-center">
                  <Heart className="h-2.5 w-2.5 mr-0.5" /> 인기
                </div>
              )}
            </div>
            
            {/* 알러지 정보 */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 justify-center">
                {getAllergenNames(product.allergens as number[]).slice(0, 2).map((allergen, idx) => (
                  <AllergyBadge key={idx} name={allergen as string} className="text-xs" />
                ))}
                {getAllergenNames(product.allergens as number[]).length > 2 && (
                  <span className="text-xs text-pink-600">+{getAllergenNames(product.allergens as number[]).length - 2}</span>
                )}
              </div>
            )}
            
            {/* 영양 정보 */}
            <div className="grid grid-cols-2 gap-1 text-xs mt-auto">
              <div className="flex items-center bg-pink-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                <span className="text-gray-700">{product.calories} kcal</span>
              </div>
              <div className="flex items-center bg-green-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.protein !== null ? `${product.protein}g 단백질` : '정보 없음'}
                </span>
              </div>
              <div className="flex items-center bg-blue-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.carbs !== null ? `${product.carbs}g 탄수화물` : '정보 없음'}
                </span>
              </div>
              <div className="flex items-center bg-yellow-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.fat !== null ? `${product.fat}g 지방` : '정보 없음'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}