import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Heart, Trash2, Store, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

export function FavoritesList({ onClose }: { onClose: () => void }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  // 좋아요 상품 목록 로드
  useEffect(() => {
    setLoading(true);
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error("좋아요 목록을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 상품 상세 페이지로 이동
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  // 좋아요 삭제
  const removeFromFavorites = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // 상품 클릭 이벤트 전파 방지
    const updatedFavorites = favorites.filter(product => product.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // 좋아요 전체 삭제
  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };
  
  // 프랜차이즈 이름 가져오기 (이후 실제 데이터로 교체 필요)
  const getFranchiseName = (franchiseId: number) => {
    // 프랜차이즈 이름 매핑
    const franchiseMap: Record<number, string> = {
      1: "맥도날드",
      2: "롯데리아",
      3: "버거킹",
      4: "KFC",
      5: "BHC",
      6: "BBQ",
      7: "파파존스",
      8: "도미노피자",
      9: "피자헛",
      10: "스타벅스",
      // 프랜차이즈 ID에 따른 이름 매핑
    };
    return franchiseMap[franchiseId] || "기타 프랜차이즈";
  };

  return (
    <div className="p-2 w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gradient-text">
          <Heart className="h-5 w-5 mr-2 text-pink-500" />
          좋아요 목록
        </h3>
        {favorites.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFavorites}
            className="text-xs text-gray-500 hover:text-pink-600"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            모두 지우기
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-pink-400">로딩 중...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8 bg-pink-50/50 rounded-lg flex flex-col items-center">
          <Heart className="h-10 w-10 text-pink-200 mb-2" />
          <p className="text-gray-500 mb-1">좋아요 목록이 비어있습니다</p>
          <p className="text-xs text-gray-400">관심있는 메뉴를 ♥ 버튼으로 추가해보세요</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="flex flex-col gap-2">
            {favorites.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg p-3 cursor-pointer border border-pink-100 shadow-sm hover:border-pink-300 flex items-center gap-2"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-pink-600 bg-pink-50 py-0.5 px-2 rounded-full flex items-center">
                      <Store className="h-2.5 w-2.5 mr-1" />
                      {getFranchiseName(product.franchiseId)}
                    </span>
                  </div>
                  <div className="font-medium text-gray-800">{product.name}</div>
                  <div className="text-[9px] text-gray-500 mt-1">
                    100g 당 영양성분
                  </div>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">{product.calories} kcal</span>
                    {product.protein && (
                      <span className="text-xs text-green-600">단백질 {product.protein}g</span>
                    )}
                    {product.carbs && (
                      <span className="text-xs text-blue-600">탄수화물 {product.carbs}g</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-pink-400 hover:text-pink-600 hover:bg-pink-50/80"
                  onClick={(e) => removeFromFavorites(e, product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}