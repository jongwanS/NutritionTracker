import { useState, useCallback } from "react";
import { useSearchParams } from "@/hooks/use-search-params";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
    <div className={cn("mb-8 bg-white p-4 rounded-lg shadow-md", className)}>
      {/* 헤더 부분 - 항상 표시 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-heading font-bold flex items-center">
            <Filter className="h-5 w-5 mr-2 text-pink-500" />
            필터
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
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
              className="ml-3 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50 border border-pink-100"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              초기화
            </Button>
          )}
        </div>
      
        {/* 필터 토글 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 border border-pink-100"
        >
          {isFilterVisible ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              필터 접기
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {/* Calories Filter */}
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium">칼로리</Label>
                  <span className="text-sm text-gray-500">{filters.calorieRange || 0} kcal 이하</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={1000}
                  step={100}
                  value={[parseInt(filters.calorieRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "calorieRange")}
                  className="mb-4"
                />
              </div>
              
              {/* Protein Filter */}
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium">단백질</Label>
                  <span className="text-sm text-gray-500">{filters.proteinRange || 0}g 이상</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={50}
                  step={5}
                  value={[parseInt(filters.proteinRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "proteinRange")}
                  className="mb-4"
                />
              </div>
              
              {/* Carbs Filter */}
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium">탄수화물</Label>
                  <span className="text-sm text-gray-500">{filters.carbsRange || 0}g 이하</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={10}
                  value={[parseInt(filters.carbsRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "carbsRange")}
                  className="mb-4"
                />
              </div>
              
              {/* Fat Filter */}
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium">지방</Label>
                  <span className="text-sm text-gray-500">{filters.fatRange || 0}g 이하</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={50}
                  step={5}
                  value={[parseInt(filters.fatRange) || 0]}
                  onValueChange={(value) => handleFilterChange(value[0].toString(), "fatRange")}
                  className="mb-4"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 활성화된 필터 표시 (필터가 접혀있고, 활성화된 필터가 있을 때) */}
      {!isFilterVisible && hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {parseInt(filters.calorieRange) > 0 && (
            <div className="bg-pink-50 px-2 py-1 text-xs rounded-full text-pink-600 border border-pink-100">
              칼로리 {filters.calorieRange}kcal 이하
            </div>
          )}
          {parseInt(filters.proteinRange) > 0 && (
            <div className="bg-pink-50 px-2 py-1 text-xs rounded-full text-pink-600 border border-pink-100">
              단백질 {filters.proteinRange}g 이상
            </div>
          )}
          {parseInt(filters.carbsRange) > 0 && (
            <div className="bg-pink-50 px-2 py-1 text-xs rounded-full text-pink-600 border border-pink-100">
              탄수화물 {filters.carbsRange}g 이하
            </div>
          )}
          {parseInt(filters.fatRange) > 0 && (
            <div className="bg-pink-50 px-2 py-1 text-xs rounded-full text-pink-600 border border-pink-100">
              지방 {filters.fatRange}g 이하
            </div>
          )}
        </div>
      )}
    </div>
  );
}