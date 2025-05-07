import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AllergyBadge } from "@/components/allergy-badge";
import { ArrowLeft, Heart, Droplet, AlertCircle, Gauge, Flame, Store } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [, navigate] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
  });
  
  // 좋아요 상태 체크
  useEffect(() => {
    if (product) {
      const favoritesString = localStorage.getItem('favorites');
      if (favoritesString) {
        try {
          const favorites = JSON.parse(favoritesString);
          const isProductFavorite = Array.isArray(favorites) && 
            favorites.some((fav: any) => fav.id === product.id);
          setIsFavorite(isProductFavorite);
        } catch (e) {
          console.error('로컬스토리지 에러:', e);
          setIsFavorite(false);
        }
      }
    }
  }, [product]);
  
  // Fetch franchises for franchise name
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
    enabled: !isLoading && !!product,
  });
  
  // Fetch categories for category name
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
    enabled: !isLoading && !!product,
  });
  
  // Get franchise and category names
  const getFranchiseName = (franchiseId: number) => {
    // 특별 처리: ID 72는 "HY 잇츠온"으로 강제 매핑 (데이터 오류 수정)
    if (franchiseId === 72) {
      return "HY 잇츠온";
    }
    if (franchiseId === 73) {
      return "신세계푸드 피코크";
    }
    
    if (!franchises) return "프랜차이즈";
    const franchise = franchises.find((f: any) => f.id === franchiseId);
    return franchise ? franchise.name : "프랜차이즈";
  };
  
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "카테고리";
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.nameKorean : "카테고리";
  };
  
  const handleBack = () => {
    // Go back to previous page
    window.history.back();
  };
  
  // 좋아요 토글 함수
  const toggleFavorite = () => {
    if (!product) return;
    
    try {
      const favoritesString = localStorage.getItem('favorites');
      let favorites = [];
      
      if (favoritesString) {
        favorites = JSON.parse(favoritesString);
        if (!Array.isArray(favorites)) favorites = [];
      }
      
      // 이미 좋아요한 상품인지 확인
      const index = favorites.findIndex((item: any) => item.id === product.id);
      
      if (index >= 0) {
        // 좋아요 삭제
        favorites.splice(index, 1);
        setIsFavorite(false);
        toast({
          title: "좋아요 삭제",
          description: "목록에서 삭제되었습니다.",
          variant: "default",
        });
      } else {
        // 좋아요 추가
        // 필요한 정보만 저장 (용량 최적화)
        const {
          id, name, description, franchiseId, categoryId, calories, protein, fat, carbs
        } = product;
        
        favorites.push({
          id, name, description, franchiseId, categoryId, calories, protein, fat, carbs
        });
        
        setIsFavorite(true);
        toast({
          title: "좋아요 추가",
          description: "목록에 추가되었습니다.",
          variant: "default",
        });
      }
      
      // 로컬스토리지에 저장
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
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
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          
          <Skeleton className="h-10 w-48 rounded-md mb-6" />
        </div>
        
        <div className="p-6 border-t border-pink-100">
          <Skeleton className="h-7 w-48 mb-6" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
        <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4 opacity-80" />
        <p className="text-primary mb-2 font-semibold">제품 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600 mb-6">잠시 후 다시 시도해 주세요.</p>
        <Button 
          onClick={handleBack}
          className="bg-white hover:bg-white/90 text-primary shadow-sm border border-pink-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold gradient-text">{product.name}</h2>
          
          {product.featuredProduct && (
            <div className="bg-pink-500/90 text-white text-xs py-1 px-3 rounded-full shadow-sm flex items-center">
              <Heart className="h-3 w-3 mr-1" /> 인기 메뉴
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        {/* Franchise/Category 정보 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center bg-pink-50 px-3 py-1.5 rounded-full text-sm text-pink-700 font-medium border border-pink-100">
            <Store className="h-3.5 w-3.5 mr-1.5" />
            {product.franchiseId ? getFranchiseName(product.franchiseId) : '프랜차이즈'}
          </div>
          <div className="bg-pink-100/50 px-3 py-1.5 rounded-full text-sm text-pink-700 font-medium border border-pink-100">
            {product.categoryId ? getCategoryName(product.categoryId) : '카테고리'}
          </div>
        </div>
        
        {/* Allergy Information */}
        {product.allergenDetails && product.allergenDetails.length > 0 && (
          <div className="mb-6 p-4 bg-pink-50/50 rounded-lg border border-pink-100">
            <h3 className="text-lg font-heading font-semibold mb-2 flex items-center text-pink-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              알레르기 정보
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.allergenDetails.map((allergen: any, index: number) => (
                <AllergyBadge key={index} name={allergen.nameKorean} />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            className="bg-white hover:bg-white/90 text-primary shadow-sm border border-pink-200"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
          
          <Button
            variant={isFavorite ? "destructive" : "secondary"}
            onClick={toggleFavorite}
            className={isFavorite 
              ? "bg-pink-500 hover:bg-pink-600" 
              : "bg-pink-100 hover:bg-pink-200 text-pink-700"}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-white" : ""}`} />
            {isFavorite ? "좋아요 취소" : "좋아요 추가"}
          </Button>
        </div>
      </div>
      

      
      {/* Nutritional Information */}
      <div className="p-6 border-t border-pink-100 bg-gradient-to-b from-white to-pink-50/30">
        <h3 className="text-xl font-heading font-semibold mb-4 gradient-text flex items-center">
          <Droplet className="h-5 w-5 mr-2 text-primary" />
          영양 정보
        </h3>
        
        <Tabs defaultValue="total" className="mb-6">
          <TabsList>
            <TabsTrigger value="total">
              전체 영양성분 {product.description && product.description.includes('전체') && (
                <span className="text-xs font-normal ml-1 opacity-80">
                  {product.description.match(/전체\s*(\d+)g\s*기준/i) 
                    ? `(중량: ${product.description.match(/전체\s*(\d+)g\s*기준/i)[1]}g)` 
                    : ''}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="per100g">100g 당 영양성분</TabsTrigger>
          </TabsList>
          
          <TabsContent value="total">
            {/* 제품 중량 정보 */}
            {product.weight ? (
              <div className="mb-4 p-3 bg-white rounded-lg border border-pink-100 shadow-sm">
                <p className="text-sm text-gray-600">
                  <span className="text-pink-700 font-medium">참고:</span> 아래 전체 영양성분은 해당 제품의 실제 중량인 {product.weight}g을 기준으로 계산한 값입니다.
                </p>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-white rounded-lg border border-pink-100 shadow-sm">
                <p className="text-sm text-gray-600">
                  <span className="text-pink-700 font-medium">참고:</span> 이 제품은 중량 정보가 없어 100g 당 영양성분 그대로 표시됩니다.
                </p>
              </div>
            )}
            
            {/* Nutrition Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold text-primary">
                  {product.calories !== null ? 
                    Math.round(product.calories * (product.weight || 100) / 100)
                    : '-'}
                </span>
                <span className="text-sm text-gray-500">칼로리 (kcal)</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-green-100">
                <span className="block text-2xl font-bold text-green-500">
                  {product.protein !== null ? 
                    `${Math.round(product.protein * (product.weight || 100) / 100 * 10) / 10}g` 
                    : '-'}
                </span>
                <span className="text-sm text-gray-500">단백질</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-blue-100">
                <span className="block text-2xl font-bold text-blue-500">
                  {product.carbs !== null ? 
                    `${Math.round(product.carbs * (product.weight || 100) / 100 * 10) / 10}g` 
                    : '-'}
                </span>
                <span className="text-sm text-gray-500">탄수화물</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                <span className="block text-2xl font-bold text-yellow-500">
                  {product.fat !== null ? 
                    `${Math.round(product.fat * (product.weight || 100) / 100 * 10) / 10}g` 
                    : '-'}
                </span>
                <span className="text-sm text-gray-500">총 지방</span>
              </div>
            </div>
            
            {/* Detailed Nutritional Table */}
            <div className="overflow-x-auto rounded-lg border border-pink-100 shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-50 to-pink-100/60">
                    <th className="py-3 px-4 text-left text-pink-800">영양소</th>
                    <th className="py-3 px-4 text-right text-pink-800">함량</th>
                    <th className="py-3 px-4 text-right text-pink-800">일일 권장량 대비 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">칼로리</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">
                      {product.calories !== null ? 
                        `${Math.round(product.calories * (product.weight || 100) / 100)} kcal` 
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.calories !== null ? 
                        `${Math.round((product.calories * (product.weight || 100) / 100) / 2000 * 100)}%` 
                        : '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                    <td className="py-3 px-4 text-right text-yellow-500 font-medium">
                      {product.fat !== null ? 
                        `${Math.round(product.fat * (product.weight || 100) / 100 * 10) / 10}g` 
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.fat !== null ? 
                        `${Math.round((product.fat * (product.weight || 100) / 100) / 65 * 100)}%` 
                        : '-'}
                    </td>
                  </tr>
              {product.saturatedFat !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 pl-8 text-gray-600">포화지방</td>
                  <td className="py-3 px-4 text-right text-orange-400">
                    {product.weight 
                      ? `${(product.saturatedFat * product.weight / 100).toFixed(1)}g` 
                      : `${product.saturatedFat}g`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.saturatedFat * product.weight / 100) 
                      : product.saturatedFat) / 20 * 100)}%
                  </td>
                </tr>
              )}
              {product.transFat !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 pl-8 text-gray-600">트랜스지방</td>
                  <td className="py-3 px-4 text-right text-orange-400">
                    {product.weight 
                      ? `${(product.transFat * product.weight / 100).toFixed(1)}g` 
                      : `${product.transFat}g`}
                  </td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              )}
              {product.cholesterol !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">콜레스테롤</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${Math.round(product.cholesterol * product.weight / 100)}mg` 
                      : `${product.cholesterol}mg`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.cholesterol * product.weight / 100) 
                      : product.cholesterol) / 300 * 100)}%
                  </td>
                </tr>
              )}
              {product.sodium !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">나트륨</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${Math.round(product.sodium * product.weight / 100)}mg` 
                      : `${product.sodium}mg`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.sodium * product.weight / 100) 
                      : product.sodium) / 2400 * 100)}%
                  </td>
                </tr>
              )}
              <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-700">탄수화물</td>
                <td className="py-3 px-4 text-right text-blue-500 font-medium">
                  {product.carbs !== null 
                    ? `${Math.round(product.carbs * (product.weight || 100) / 100 * 10) / 10}g` 
                    : '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  {product.carbs !== null 
                    ? `${Math.round((product.carbs * (product.weight || 100) / 100) / 300 * 100)}%` 
                    : '-'}
                </td>
              </tr>
              {product.fiber !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 pl-8 text-gray-600">식이섬유</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${(product.fiber * product.weight / 100).toFixed(1)}g` 
                      : `${product.fiber}g`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.fiber * product.weight / 100) 
                      : product.fiber) / 25 * 100)}%
                  </td>
                </tr>
              )}
              {product.sugar !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 pl-8 text-gray-600">당류</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${(product.sugar * product.weight / 100).toFixed(1)}g` 
                      : `${product.sugar}g`}
                  </td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              )}
              <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-700">단백질</td>
                <td className="py-3 px-4 text-right text-green-500 font-medium">
                  {product.protein !== null 
                    ? `${Math.round(product.protein * (product.weight || 100) / 100 * 10) / 10}g` 
                    : '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  {product.protein !== null 
                    ? `${Math.round((product.protein * (product.weight || 100) / 100) / 50 * 100)}%` 
                    : '-'}
                </td>
              </tr>
              {product.calcium !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">칼슘</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${Math.round(product.calcium * product.weight / 100)}%` 
                      : `${product.calcium}%`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${Math.round(product.calcium * product.weight / 100)}%` 
                      : `${product.calcium}%`}
                  </td>
                </tr>
              )}
              {product.iron !== null && (
                <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">철분</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${(product.iron * product.weight / 100).toFixed(1)}mg` 
                      : `${product.iron}mg`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.iron * product.weight / 100) 
                      : product.iron) / 18 * 100)}%
                  </td>
                </tr>
              )}
              {product.vitaminD !== null && (
                <tr className="hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-700">비타민 D</td>
                  <td className="py-3 px-4 text-right">
                    {product.weight 
                      ? `${(product.vitaminD * product.weight / 100).toFixed(1)}mcg` 
                      : `${product.vitaminD}mcg`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Math.round((product.weight 
                      ? (product.vitaminD * product.weight / 100) 
                      : product.vitaminD) / 20 * 100)}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 bg-white p-3 rounded-lg border border-pink-100 shadow-sm">
              <span className="text-pink-500 font-medium">*</span> 퍼센트 일일 권장량은 2,000 칼로리 식이요법을 기준으로 합니다. 개인 칼로리 필요량에 따라 일일 권장치는 다를 수 있습니다.
            </p>
            

          </TabsContent>
          
          <TabsContent value="per100g">
            {/* Nutrition Highlights per 100g */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold text-primary">
                  {product.calories !== null ? product.calories : '-'}
                </span>
                <span className="text-sm text-gray-500">칼로리 (kcal)</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-green-100">
                <span className="block text-2xl font-bold text-green-500">
                  {product.protein !== null ? `${product.protein}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">단백질</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-blue-100">
                <span className="block text-2xl font-bold text-blue-500">
                  {product.carbs !== null ? `${product.carbs}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">탄수화물</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                <span className="block text-2xl font-bold text-yellow-500">
                  {product.fat !== null ? `${product.fat}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">총 지방</span>
              </div>
            </div>

            {/* Detailed Nutritional Table per 100g */}
            <div className="overflow-x-auto rounded-lg border border-pink-100 shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-50 to-pink-100/60">
                    <th className="py-3 px-4 text-left text-pink-800">영양소</th>
                    <th className="py-3 px-4 text-right text-pink-800">100g당 함량</th>
                    <th className="py-3 px-4 text-right text-pink-800">일일 권장량 대비 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">칼로리</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">
                      {product.calories !== null ? `${product.calories} kcal` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.calories !== null ? `${Math.round(product.calories / 2000 * 100)}%` : '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                    <td className="py-3 px-4 text-right text-yellow-500 font-medium">
                      {product.fat !== null ? `${product.fat}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.fat !== null ? `${Math.round(product.fat / 65 * 100)}%` : '-'}
                    </td>
                  </tr>
                  {product.saturatedFat !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">포화지방</td>
                      <td className="py-3 px-4 text-right text-orange-400">
                        {product.saturatedFat !== null ? `${product.saturatedFat}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.saturatedFat !== null ? `${Math.round(product.saturatedFat / 20 * 100)}%` : '-'}
                      </td>
                    </tr>
                  )}
                  {product.transFat !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">트랜스지방</td>
                      <td className="py-3 px-4 text-right text-orange-400">
                        {product.transFat !== null ? `${product.transFat}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                  )}
                  {product.cholesterol !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">콜레스테롤</td>
                      <td className="py-3 px-4 text-right">
                        {product.cholesterol !== null ? `${product.cholesterol}mg` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.cholesterol !== null ? `${Math.round(product.cholesterol / 300 * 100)}%` : '-'}
                      </td>
                    </tr>
                  )}
                  {product.sodium !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">나트륨</td>
                      <td className="py-3 px-4 text-right">
                        {product.sodium !== null ? `${product.sodium}mg` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.sodium !== null ? `${Math.round(product.sodium / 2400 * 100)}%` : '-'}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">탄수화물</td>
                    <td className="py-3 px-4 text-right text-blue-500 font-medium">
                      {product.carbs !== null ? `${product.carbs}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.carbs !== null ? `${Math.round(product.carbs / 300 * 100)}%` : '-'}
                    </td>
                  </tr>
                  {product.fiber !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">식이섬유</td>
                      <td className="py-3 px-4 text-right">
                        {product.fiber !== null ? `${product.fiber}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.fiber !== null ? `${Math.round(product.fiber / 25 * 100)}%` : '-'}
                      </td>
                    </tr>
                  )}
                  {product.sugar !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">당류</td>
                      <td className="py-3 px-4 text-right">
                        {product.sugar !== null ? `${product.sugar}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                  )}
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">단백질</td>
                    <td className="py-3 px-4 text-right text-green-500 font-medium">
                      {product.protein !== null ? `${product.protein}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.protein !== null ? `${Math.round(product.protein / 50 * 100)}%` : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 bg-white p-3 rounded-lg border border-pink-100 shadow-sm">
              <span className="text-pink-500 font-medium">*</span> 100g 당 영양성분 함량은 식품의약품안전처 식품영양성분 데이터베이스를 기준으로 합니다.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
