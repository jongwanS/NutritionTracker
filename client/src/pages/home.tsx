import { useState, useEffect } from "react";
import { CategoryGrid } from "@/components/category-grid";
import { FilterBar } from "@/components/ui/filter-bar";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { BannerAd, ResponsiveAd } from "@/components/ui/advertisement";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    calorieRange: searchParams.get("calorieRange") || "",
    proteinRange: searchParams.get("proteinRange") || "",
    carbsRange: searchParams.get("carbsRange") || "",
    fatRange: searchParams.get("fatRange") || ""
  });

  // 필터 변경을 처리하는 함수
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = () => {
    if (searchTerm.trim() || hasActiveFilters()) {
      // URL 쿼리 생성
      let query = searchTerm.trim() ? `?q=${encodeURIComponent(searchTerm.trim())}` : "?";
      
      // 필터 조건 추가
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          // 첫 번째 파라미터인 경우 ? 대신 & 사용
          const separator = query === "?" ? "" : "&";
          query += `${separator}${key}=${encodeURIComponent(value)}`;
        }
      });
      
      // 검색 결과 페이지로 이동
      navigate(`/search${query}`);
    }
  };

  // 필터가 하나라도 활성화되어 있는지 확인
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== "");
  };

  return (
    <>
      {/* 히어로 섹션 */}
      <div className="mb-8 p-8 bg-gradient-to-r from-primary/5 to-primary/20 rounded-2xl">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6 text-gray-700">
            다양한 프랜차이즈 메뉴의 영양성분을 검색하고 비교해보세요
          </p>
          
          {/* SearchBar 직접 구현으로 변경 */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="메뉴 이름 또는 프랜차이즈로 검색"
              className="w-full pr-10 pl-4 py-2 border-2 border-primary/20 focus:border-primary/50 rounded-full"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full rounded-r-full text-primary/80 hover:text-primary hover:bg-primary/5"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <FilterBar onFilterChange={handleFilterChange} />
      
      {/* 필터 적용 검색 버튼 */}
      {hasActiveFilters() && (
        <div className="mb-8 text-center">
          <Button 
            onClick={handleSearch}
            className="px-6 py-2 bg-primary hover:bg-primary-600 text-white rounded-full shadow-md flex items-center justify-center mx-auto"
          >
            <Search className="h-4 w-4 mr-2" />
            필터 적용하여 검색
          </Button>
        </div>
      )}
      
      <CategoryGrid />
      

    </>
  );
}
