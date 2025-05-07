import { useState, useCallback } from "react";
import { useSearchParams } from "@/hooks/use-search-params";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDown, ChevronUp, Filter, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FilterBarProps {
  className?: string;
  onFilterChange?: (filters: {
    calorieRange: string;
    proteinRange: string;
    carbsRange: string;
    fatRange: string;
  }) => void;
}

export function FilterBar({ className, onFilterChange }: FilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 초기 값 가져오기
  const initialCalorieRange = searchParams.get("calorieRange") || "0";
  const initialProteinRange = searchParams.get("proteinRange") || "0";
  const initialCarbsRange = searchParams.get("carbsRange") || "0";
  const initialFatRange = searchParams.get("fatRange") || "0";
  
  // 현재 필터 상태 관리
  const [filters, setFilters] = useState({
    calorieRange: initialCalorieRange,
    proteinRange: initialProteinRange,
    carbsRange: initialCarbsRange,
    fatRange: initialFatRange
  });
  
  // 필터 UI 표시 여부
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // 디버깅 로그
  console.log("FilterBar 렌더링 - 현재 필터:", filters);

  // 필터 변경 처리 함수
  const handleFilterChange = useCallback((value: string, filterName: keyof typeof filters) => {
    // 값이 0인 경우 "0"으로 명시적 처리 (빈 문자열이 아님)
    const newValue = value;
    
    const updatedFilters = {
      ...filters,
      [filterName]: newValue
    };
    
    console.log(`필터 변경: ${filterName} = ${newValue}`);
    setFilters(updatedFilters);
    
    // URL 파라미터 업데이트 - 필터가 0이 아닌 경우에만 파라미터 추가
    const newParams = new URLSearchParams();
    
    // franchiseId 파라미터만 유지 (다른 파라미터는 모두 필터 관련)
    const franchiseId = searchParams.get("franchiseId");
    if (franchiseId) {
      newParams.set("franchiseId", franchiseId);
    }
    
    // 업데이트된 필터 값 적용
    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (val && val !== "0") {
        newParams.set(key, val as string);
      }
    });
    
    // URL 업데이트
    console.log("URL 파라미터 업데이트:", Object.fromEntries(newParams.entries()));
    setSearchParams(newParams);
    
    // 상위 컴포넌트에 필터 변경 알림
    if (onFilterChange) {
      console.log('필터 변경 콜백 호출:', updatedFilters);
      onFilterChange(updatedFilters);
    }
  }, [filters, onFilterChange, searchParams, setSearchParams]);

  // 필터 초기화 함수
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      calorieRange: "0",
      proteinRange: "0",
      carbsRange: "0",
      fatRange: "0"
    };
    
    console.log('필터 초기화');
    setFilters(defaultFilters);
    
    // URL 파라미터 제거
    const newParams = new URLSearchParams(searchParams);
    Object.keys(defaultFilters).forEach(key => {
      newParams.delete(key);
    });
    setSearchParams(newParams);
    
    // 콜백 호출
    if (onFilterChange) {
      console.log('필터 초기화 콜백 호출');
      onFilterChange(defaultFilters);
    }
  }, [onFilterChange, searchParams, setSearchParams]);

  // 활성화된 필터가 있는지 확인
  const hasActiveFilters = Object.values(filters).some(value => value !== "0" && value !== "");

  // 활성화된 필터 개수
  const activeFilterCount = Object.values(filters).filter(value => value !== "0" && value !== "").length;
  
  return (
    <div className={cn("mb-8 bg-gradient-to-b from-white to-pink-50/30 p-5 rounded-xl shadow-lg border border-pink-100", className)}>
      {/* 헤더 부분 - 항상 표시 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-heading font-bold flex items-center gradient-text">
            <Filter className="h-5 w-5 mr-2 text-pink-500" />
            필터
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2.5 py-1 bg-gradient-to-r from-pink-500 to-pink-400 text-white text-xs rounded-full shadow-sm flex items-center justify-center min-w-[1.5rem]">
                {activeFilterCount}
              </span>
            )}
          </h2>
          
          {/* 필터 초기화 버튼 */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="ml-4 text-xs font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50/70 border border-pink-200 shadow-sm rounded-full px-3"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              초기화
            </Button>
          )}
        </div>
      
        {/* 필터 토글 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={`text-pink-600 hover:text-pink-700 hover:bg-pink-50/70 border rounded-full px-4 py-2 shadow-sm transition-all duration-300 ${
            isFilterVisible 
              ? "bg-pink-100/50 border-pink-200" 
              : "bg-white border-pink-100"
          }`}
        >
          {isFilterVisible ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              필터 접기
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              필터 펼치기
            </>
          )}
        </Button>
      </div>
        
      {/* 필터 컨텐츠 - 접기/펼치기 */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {/* Calories Filter */}
              <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-semibold text-pink-800 flex items-center">
                    <Flame className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
                    칼로리
                  </Label>
                  <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-pink-400 text-white px-2 py-0.5 rounded-md">
                    {filters.calorieRange || 0} kcal 이하
                  </span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={1000}
                  step={100}
                  value={[parseInt(filters.calorieRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "calorieRange")}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                </div>
              </div>
              
              {/* Protein Filter */}
              <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-sm border border-green-100">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-semibold text-green-800 flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1.5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                      <path d="M12 6V2M12 6H7M12 6H17M7 12H5M7 12C7 13.5 9 16.5 12 16.5C15 16.5 17 13.5 17 12M7 12C7 10.5 9 7.5 12 7.5C15 7.5 17 10.5 17 12M17 12H19M12 18V22" />
                    </svg>
                    단백질
                  </Label>
                  <span className="text-sm font-medium bg-gradient-to-r from-green-500 to-green-400 text-white px-2 py-0.5 rounded-md">
                    {filters.proteinRange || 0}g 이상
                  </span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={50}
                  step={5}
                  value={[parseInt(filters.proteinRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "proteinRange")}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
              
              {/* Carbs Filter */}
              <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-semibold text-blue-800 flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1.5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                      <path d="M8 13V12M12 13V10M16 13V8M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    탄수화물
                  </Label>
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-400 text-white px-2 py-0.5 rounded-md">
                    {filters.carbsRange || 0}g 이하
                  </span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={10}
                  value={[parseInt(filters.carbsRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "carbsRange")}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              
              {/* Fat Filter */}
              <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-semibold text-yellow-800 flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1.5 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12M6 18L18 6M12 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                    지방
                  </Label>
                  <span className="text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-2 py-0.5 rounded-md">
                    {filters.fatRange || 0}g 이하
                  </span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={50}
                  step={5}
                  value={[parseInt(filters.fatRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "fatRange")}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 활성화된 필터 표시 (필터가 접혀있고, 활성화된 필터가 있을 때) */}
      {!isFilterVisible && hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {parseInt(filters.calorieRange) > 0 && (
            <div className="bg-gradient-to-r from-pink-500/90 to-pink-400/90 text-white px-3 py-1.5 text-xs rounded-full shadow-sm border border-pink-200 flex items-center font-medium">
              <Flame className="h-3 w-3 mr-1.5" />
              칼로리 {filters.calorieRange}kcal 이하
            </div>
          )}
          {parseInt(filters.proteinRange) > 0 && (
            <div className="bg-gradient-to-r from-green-500/90 to-green-400/90 text-white px-3 py-1.5 text-xs rounded-full shadow-sm border border-green-200 flex items-center font-medium">
              <svg className="h-3 w-3 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                <path d="M12 6V2M12 6H7M12 6H17M7 12H5M7 12C7 13.5 9 16.5 12 16.5C15 16.5 17 13.5 17 12M7 12C7 10.5 9 7.5 12 7.5C15 7.5 17 10.5 17 12M17 12H19M12 18V22" />
              </svg>
              단백질 {filters.proteinRange}g 이상
            </div>
          )}
          {parseInt(filters.carbsRange) > 0 && (
            <div className="bg-gradient-to-r from-blue-500/90 to-blue-400/90 text-white px-3 py-1.5 text-xs rounded-full shadow-sm border border-blue-200 flex items-center font-medium">
              <svg className="h-3 w-3 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                <path d="M8 13V12M12 13V10M16 13V8M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              탄수화물 {filters.carbsRange}g 이하
            </div>
          )}
          {parseInt(filters.fatRange) > 0 && (
            <div className="bg-gradient-to-r from-yellow-500/90 to-yellow-400/90 text-white px-3 py-1.5 text-xs rounded-full shadow-sm border border-yellow-200 flex items-center font-medium">
              <svg className="h-3 w-3 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6M12 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              지방 {filters.fatRange}g 이하
            </div>
          )}
        </div>
      )}
    </div>
  );
}