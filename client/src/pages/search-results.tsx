import * as React from "react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { FilterBar } from "@/components/ui/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Product } from "@/types";
import { Heart, AlertCircle, Search, Store, Grid, List, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const { toast } = useToast();
  
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
  
  // 무한 스크롤을 위한 상태
  const [visibleItems, setVisibleItems] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const query = searchParams.get("q") || "";
  const calorieRange = searchParams.get("calorieRange") || "";
  const proteinRange = searchParams.get("proteinRange") || "";
  const carbsRange = searchParams.get("carbsRange") || "";
  const fatRange = searchParams.get("fatRange") || "";
  const categoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId") || "0") : undefined;
  
  // 검색창 초기값 설정
  useEffect(() => {
    setSearchInput(query);
  }, [query]);
  
  // 검색할 조건이 있는지 확인 (검색어 또는 필터 중 하나라도)
  const hasSearchConditions = query.length > 0 || 
                             !!calorieRange || 
                             !!proteinRange || 
                             !!carbsRange || 
                             !!fatRange;
  
  // Create query parameter string
  const filterParams = new URLSearchParams();
  filterParams.append("q", query);
  
  // 영양소 필터는 클라이언트 측에서 처리하므로 서버 요청에 포함하지 않음
  if (categoryId) filterParams.append("categoryId", categoryId.toString());
  
  // 검색 쿼리 함수
  const fetchSearchResults = async () => {
    try {
      const res = await fetch(`/api/search?${filterParams.toString()}`);
      if (!res.ok) {
        console.error('검색 API 응답 오류:', res.status);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('검색 API 요청 오류:', err);
      return [];
    }
  };
  
  // 검색 결과를 가져온다 (URL 변경시마다 다시 불러옴)
  const { data: initialSearchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', query, categoryId], // query를 직접 포함시켜 변경시 재요청
    queryFn: fetchSearchResults,
    enabled: hasSearchConditions || categoryId !== undefined,
    staleTime: 0, // 캐싱하지 않음 (항상 최신 결과)
    refetchOnWindowFocus: false // 창 포커스 시 자동 재요청 방지
  });
  
  // 초기 검색 결과와 필터된 결과를 별도로 관리
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  
  // 필터 적용 함수 - 이 함수를 직접 호출하여 결과를 필터링
  const applyFilters = useCallback((results: Product[]) => {
    if (!results || !Array.isArray(results)) {
      console.log("유효하지 않은 결과:", results);
      setFilteredResults([]);
      return;
    }
    
    console.log(`필터링 전 결과 수: ${results.length}`);
    
    let filtered = [...results];
    
    // 칼로리 필터
    if (calorieRange && parseInt(calorieRange) > 0) {
      filtered = filtered.filter(p => p.calories <= parseInt(calorieRange));
      console.log(`칼로리 필터 (${calorieRange} kcal 이하) 적용 후: ${filtered.length}개`);
    }
    
    // 단백질 필터 (이상으로 변경 - 헬스 유저를 위한 기능)
    if (proteinRange && parseInt(proteinRange) > 0) {
      filtered = filtered.filter(p => p.protein >= parseInt(proteinRange));
      console.log(`단백질 필터 (${proteinRange}g 이상) 적용 후: ${filtered.length}개`);
    }
    
    // 탄수화물 필터
    if (carbsRange && parseInt(carbsRange) > 0) {
      filtered = filtered.filter(p => p.carbs <= parseInt(carbsRange));
      console.log(`탄수화물 필터 (${carbsRange}g 이하) 적용 후: ${filtered.length}개`);
    }
    
    // 지방 필터
    if (fatRange && parseInt(fatRange) > 0) {
      filtered = filtered.filter(p => p.fat <= parseInt(fatRange));
      console.log(`지방 필터 (${fatRange}g 이하) 적용 후: ${filtered.length}개`);
    }
    
    console.log(`최종 필터링 결과 수: ${filtered.length}`);
    setFilteredResults(filtered);
    // 필터 변경시 표시 항목 초기화
    setVisibleItems(20);
  }, [calorieRange, proteinRange, carbsRange, fatRange]);
  
  // 초기 검색 결과가 로드되면 필터 적용
  useEffect(() => {
    console.log('초기 검색 결과 변경됨:', initialSearchResults?.length);
    if (initialSearchResults) {
      applyFilters(initialSearchResults);
    }
  }, [initialSearchResults, applyFilters]);
  
  // 필터값 변경 시 필터 적용 (별도 useEffect로 분리)
  useEffect(() => {
    console.log('필터 변경됨:', { calorieRange, proteinRange, carbsRange, fatRange });
    if (initialSearchResults) {
      applyFilters(initialSearchResults);
    }
  }, [calorieRange, proteinRange, carbsRange, fatRange, initialSearchResults, applyFilters]);
  
  // 화면에 표시할 결과 (무한 스크롤 처리)
  const displayResults = useMemo(() => {
    return filteredResults.slice(0, visibleItems);
  }, [filteredResults, visibleItems]);
  
  // 더 많은 항목을 로드하는 함수
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || visibleItems >= filteredResults.length) return;
    
    setIsLoadingMore(true);
    
    // 로딩 애니메이션을 위한 짧은 지연
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 20, filteredResults.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, visibleItems, filteredResults.length]);
  
  // Intersection Observer를 사용한 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 } // 10% 가시성에서 트리거
    );
    
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreItems]);
  
  // Fetch allergens for badges
  const { data: allergens } = useQuery({
    queryKey: ['/api/allergens'],
    queryFn: () => fetch('/api/allergens').then(res => res.json()),
  });
  
  // Fetch franchises to display franchise names
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
  });
  
  // Get franchise name for a product
  const getFranchiseName = (franchiseId: number) => {
    if (!franchises) return "";
    const franchise = franchises.find((f: any) => f.id === franchiseId);
    return franchise ? franchise.name : "";
  };
  
  // Get allergen names for a product
  const getAllergenNames = (allergenIds: number[]) => {
    if (!allergens || !allergenIds) return [];
    return allergenIds.map(id => allergens.find((a: any) => a.id === id)?.nameKorean).filter(Boolean);
  };
  
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
        favorites.push({
          id: product.id,
          name: product.name,
          description: product.description,
          franchiseId: product.franchiseId,
          calories: product.calories,
          protein: product.protein,
          fat: product.fat,
          carbs: product.carbs
        });
        
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
  
  // 검색 실행 함수
  const handleSearch = () => {
    // 검색어 체크 (빈 값이면 무시)
    if (!searchInput.trim()) return;
    
    // 새 검색을 위한 파라미터 생성 (기존 파라미터 복사하지 않고 새로 생성)
    const newParams = new URLSearchParams();
    
    // 검색어 설정
    newParams.set("q", searchInput.trim());
    
    // 현재 URL에서 필터 파라미터 가져오기 - 최신값 보장
    const currentCalorieRange = searchParams.get("calorieRange") || "";
    const currentProteinRange = searchParams.get("proteinRange") || "";
    const currentCarbsRange = searchParams.get("carbsRange") || "";
    const currentFatRange = searchParams.get("fatRange") || "";
    const currentCategoryId = searchParams.get("categoryId") || "";
    
    // 필터값 추가 (있는 경우에만)
    if (currentCalorieRange) newParams.set("calorieRange", currentCalorieRange);
    if (currentProteinRange) newParams.set("proteinRange", currentProteinRange);
    if (currentCarbsRange) newParams.set("carbsRange", currentCarbsRange);
    if (currentFatRange) newParams.set("fatRange", currentFatRange);
    if (currentCategoryId) newParams.set("categoryId", currentCategoryId);
    
    console.log("검색 실행:", searchInput, newParams.toString());
    
    // URL 업데이트 (새 검색 파라미터로)
    setSearchParams(newParams);
    
    // 페이지 최상단으로 스크롤
    window.scrollTo(0, 0);
  };
  
  // Enter 키 누르면 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 필터 변경 시 실행할 함수 - FilterBar로부터 호출됨
  const handleFilterChange = (newFilters: any) => {
    console.log("필터 변경됨:", newFilters); // 디버깅용
    
    // 서버 검색결과는 유지하되, 클라이언트 필터링만 수행
    if (initialSearchResults) {
      const results = [...initialSearchResults];
      let filtered = results;
      
      // 칼로리 필터
      if (newFilters.calorieRange && parseInt(newFilters.calorieRange) > 0) {
        filtered = filtered.filter(p => p.calories <= parseInt(newFilters.calorieRange));
        console.log(`칼로리 필터 (${newFilters.calorieRange} kcal 이하) 적용 후: ${filtered.length}개`);
      }
      
      // 단백질 필터 (이상으로 변경 - 헬스 유저 위한 기능)
      if (newFilters.proteinRange && parseInt(newFilters.proteinRange) > 0) {
        filtered = filtered.filter(p => p.protein >= parseInt(newFilters.proteinRange));
        console.log(`단백질 필터 (${newFilters.proteinRange}g 이상) 적용 후: ${filtered.length}개`);
      }
      
      // 탄수화물 필터
      if (newFilters.carbsRange && parseInt(newFilters.carbsRange) > 0) {
        filtered = filtered.filter(p => p.carbs <= parseInt(newFilters.carbsRange));
        console.log(`탄수화물 필터 (${newFilters.carbsRange}g 이하) 적용 후: ${filtered.length}개`);
      }
      
      // 지방 필터
      if (newFilters.fatRange && parseInt(newFilters.fatRange) > 0) {
        filtered = filtered.filter(p => p.fat <= parseInt(newFilters.fatRange));
        console.log(`지방 필터 (${newFilters.fatRange}g 이하) 적용 후: ${filtered.length}개`);
      }
      
      console.log(`최종 필터링 결과 수: ${filtered.length}`);
      setFilteredResults(filtered);
      // 필터 변경 시 표시 항목 초기화
      setVisibleItems(20);
    }
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Search className="w-6 h-6 text-primary mr-2" />
          <h1 className="text-3xl font-heading font-bold gradient-text">검색 결과</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-primary/20 hover:bg-primary/5 hover:text-primary"
        >
          홈으로 돌아가기
        </Button>
      </div>

      {/* 검색 입력 필드 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="메뉴 이름으로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button onClick={handleSearch} className="shadow-sm">
          검색
        </Button>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />
      
      {/* 검색 필터 아래 광고 배너 */}

      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 bg-pink-50/60 py-2 px-4 rounded-lg inline-block border border-pink-100 shadow-sm">
            {query ? (
              <span>
                <span className="font-semibold text-pink-700">"{query}"</span>에 대한 검색 결과입니다
              </span>
            ) : (
              <span>
                <span className="font-semibold text-pink-700">필터 적용</span> 검색 결과입니다
              </span>
            )}
            {(calorieRange || proteinRange || carbsRange || fatRange) && (
              <span className="ml-2 text-xs bg-pink-200/70 px-2 py-1 rounded-full">
                필터 적용됨
              </span>
            )}
          </p>
          
          {/* 뷰 타입 전환 버튼 */}
          <div className="flex bg-pink-50 rounded-lg p-1 border border-pink-100">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md ${viewType === 'grid' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewType('grid')}
              title="바둑판형 보기"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewType('list')}
              title="목록형 보기"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white border border-pink-100 rounded-xl">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 border-t border-pink-50">
                <Skeleton className="h-4 w-32 mb-2 rounded-full" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
          <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3 opacity-80" />
          <p className="text-primary mb-2 font-semibold">검색 중 오류가 발생했습니다.</p>
          <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
        </div>
      ) : (!Array.isArray(filteredResults) || filteredResults.length === 0) ? (
        <div className="text-center py-12 bg-pink-50/50 rounded-lg p-8">
          <Search className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
          <p className="text-gray-600 mb-2 font-semibold">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-500">다른 검색어로 시도해 보세요.</p>
        </div>
      ) : viewType === 'grid' ? (
        // 바둑판형 뷰 (Grid View)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayResults.map((product, index) => (
            <React.Fragment key={`product-${product.id}`}>

            
              <div 
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

                  {/* 프랜차이즈 정보 */}
                  <div className="flex justify-center text-xs font-medium text-pink-600 mb-1">
                    <div className="bg-pink-50 py-0.5 px-2 rounded-full w-fit flex items-center">
                      <Store className="h-2.5 w-2.5 mr-1" />
                      {getFranchiseName(product.franchiseId)}
                    </div>
                  </div>
                
                  {/* 제품 이름 영역 */}
                  <div className="mb-2 text-center">
                    <h3 className="text-base font-heading font-semibold gradient-text line-clamp-2">{product.name}</h3>
                    {product.featuredProduct && (
                      <div className="inline-flex mt-1 bg-pink-500/90 text-white text-xs py-0.5 px-1.5 rounded-full shadow-sm items-center">
                        <Heart className="h-2.5 w-2.5 mr-0.5" /> 인기
                      </div>
                    )}
                  </div>
                  
                  {/* 알러지 정보 삭제됨 */}
                  
                  {/* 영양 정보 */}
                  <div className="grid grid-cols-1 gap-1 text-xs mt-auto">
                    {/* 영양정보 기준 안내 */}
                    <div className="text-center text-[10px] text-gray-500 mb-1 bg-gray-100/70 py-0.5 rounded">
                      100g 당 영양성분
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center bg-pink-50 px-1.5 py-1 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                        <span className="text-gray-700">{product.calories} kcal</span>
                      </div>
                      <div className="flex items-center bg-green-50 px-1.5 py-1 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-gray-700 truncate">
                          {product.protein !== null ? `${product.protein}g 단백질` : '-'}
                        </span>
                      </div>
                      <div className="flex items-center bg-blue-50 px-1.5 py-1 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        <span className="text-gray-700 truncate">
                          {product.carbs !== null ? `${product.carbs}g 탄수화물` : '-'}
                        </span>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-1.5 py-1 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                        <span className="text-gray-700 truncate">
                          {product.fat !== null ? `${product.fat}g 지방` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        // 목록형 뷰 (List View)
        <div className="flex flex-col gap-4">
          {displayResults.map((product, index) => (
            <React.Fragment key={`product-list-${product.id}`}>

              
              <div 
                className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100 cursor-pointer p-4 relative"
                onClick={() => handleProductSelect(product.id)}
              >
                {/* 좋아요 버튼 */}
                <Button
                  variant="ghost" 
                  size="icon"
                  className={`absolute top-2 right-2 h-8 w-8 p-0 z-10 ${
                    favoriteProducts.includes(product.id) 
                      ? 'text-pink-500 bg-pink-50/80' 
                      : 'text-gray-400 hover:text-pink-400 bg-white/80'
                  }`}
                  onClick={(e) => toggleFavorite(e, product)}
                >
                  <Heart className={`h-5 w-5 ${favoriteProducts.includes(product.id) ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex flex-wrap md:flex-nowrap">
                  <div className="w-full md:w-8/12">
                    <div className="flex items-center text-xs font-medium text-pink-600 mb-2">
                      <div className="bg-pink-50 py-0.5 px-2 rounded-full w-fit flex items-center">
                        <Store className="h-2.5 w-2.5 mr-1" />
                        {getFranchiseName(product.franchiseId)}
                      </div>
                      
                      {product.featuredProduct && (
                        <div className="ml-2 bg-pink-500/90 text-white text-xs py-0.5 px-1.5 rounded-full flex items-center">
                          <Heart className="h-2.5 w-2.5 mr-0.5" /> 인기
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-heading font-semibold mb-2 gradient-text">{product.name}</h3>
                    
                    {/* 알러지 정보 삭제됨 */}
                  </div>
                  
                  <div className="w-full md:w-4/12 mt-3 md:mt-0 md:pl-4 md:border-l border-pink-50">
                    {/* 영양정보 기준 안내 */}
                    <div className="text-center text-[10px] text-gray-500 mb-2 bg-gray-100/70 py-0.5 rounded">
                      100g 당 영양성분
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center bg-pink-50 px-2 py-1 rounded-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary mr-1.5"></span>
                        <span className="text-gray-700">{product.calories} kcal</span>
                      </div>
                      <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>
                        <span className="text-gray-700 truncate">
                          {product.protein !== null ? `${product.protein}g 단백질` : '-'}
                        </span>
                      </div>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>
                        <span className="text-gray-700 truncate">
                          {product.carbs !== null ? `${product.carbs}g 탄수화물` : '-'}
                        </span>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></span>
                        <span className="text-gray-700 truncate">
                          {product.fat !== null ? `${product.fat}g 지방` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* 무한 스크롤 로더 */}
      {!isLoading && !error && Array.isArray(filteredResults) && filteredResults.length > 0 && 
       displayResults.length < filteredResults.length && (
        <div ref={loadMoreRef} className="flex justify-center items-center py-10">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-gray-500">더 많은 결과 로딩 중...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={loadMoreItems}
              className="bg-white shadow-sm border-pink-100 hover:bg-pink-50 text-sm"
            >
              더 많은 결과 보기 ({displayResults.length}/{filteredResults.length})
            </Button>
          )}
        </div>
      )}
      
      {/* 검색 결과 통계 */}
      {filteredResults.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          총 <span className="font-medium text-primary">{filteredResults.length}</span>개 결과 중 
          <span className="font-medium text-primary"> {Math.min(displayResults.length, filteredResults.length)}</span>개 표시됨
        </div>
      )}
      

    </>
  );
}