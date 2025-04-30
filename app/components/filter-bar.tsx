'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FilterProps = {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
};

export default function FilterBar({ onFilterChange, initialFilters = {} }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 필터 상태 설정
  const [filters, setFilters] = useState({
    calorieRange: initialFilters.calorieRange || searchParams.get('calorieRange') || '0',
    proteinRange: initialFilters.proteinRange || searchParams.get('proteinRange') || '0',
    carbsRange: initialFilters.carbsRange || searchParams.get('carbsRange') || '0',
    fatRange: initialFilters.fatRange || searchParams.get('fatRange') || '0',
  });
  
  // 필터 패널 접힘/펼침 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // 디버깅용 로그
  useEffect(() => {
    console.log('FilterBar 렌더링 - 현재 필터:', filters);
  }, [filters]);

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      
      // 상위 컴포넌트에 필터 변경 알림
      onFilterChange(newFilters);
      
      return newFilters;
    });
  };
  
  // 필터 초기화 
  const resetFilters = () => {
    const defaultFilters = {
      calorieRange: '0',
      proteinRange: '0',
      carbsRange: '0',
      fatRange: '0',
    };
    
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  // 필터가 적용된 상태인지 확인
  const isFiltersApplied = () => {
    return filters.calorieRange !== '0' || 
           filters.proteinRange !== '0' || 
           filters.carbsRange !== '0' || 
           filters.fatRange !== '0';
  };

  // 필터 패널 토글
  const toggleFilterPanel = () => {
    console.log('토글 클릭됨 - 현재 상태:', isExpanded, '-> 새 상태:', !isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 relative z-10">
      <div 
        className="w-full flex justify-between items-center cursor-pointer p-3 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-200"
        onClick={toggleFilterPanel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFilterPanel();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-700">영양정보 필터</h3>
          {isFiltersApplied() && (
            <span className="ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full">
              적용됨
            </span>
          )}
        </div>
        <div className="flex items-center">
          {isFiltersApplied() && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="text-xs text-pink-600 hover:text-pink-700 mr-3"
            >
              초기화
            </button>
          )}
          <div className="bg-pink-100 p-1.5 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 mt-4 border-t pt-4">
          {/* 칼로리 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              칼로리 ({filters.calorieRange === '0' ? '제한 없음' : `${filters.calorieRange} kcal 이하`})
            </label>
            <input
              type="range"
              name="calorieRange"
              min="0"
              max="1000"
              step="50"
              value={filters.calorieRange}
              onChange={handleFilterChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>500</span>
              <span>1000 kcal</span>
            </div>
          </div>
          
          {/* 단백질 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              단백질 ({filters.proteinRange === '0' ? '제한 없음' : `${filters.proteinRange}g 이상`})
            </label>
            <input
              type="range"
              name="proteinRange"
              min="0"
              max="50"
              step="2"
              value={filters.proteinRange}
              onChange={handleFilterChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>25</span>
              <span>50g</span>
            </div>
          </div>
          
          {/* 탄수화물 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              탄수화물 ({filters.carbsRange === '0' ? '제한 없음' : `${filters.carbsRange}g 이하`})
            </label>
            <input
              type="range"
              name="carbsRange"
              min="0"
              max="100"
              step="5"
              value={filters.carbsRange}
              onChange={handleFilterChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100g</span>
            </div>
          </div>
          
          {/* 지방 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지방 ({filters.fatRange === '0' ? '제한 없음' : `${filters.fatRange}g 이하`})
            </label>
            <input
              type="range"
              name="fatRange"
              min="0"
              max="50"
              step="2"
              value={filters.fatRange}
              onChange={handleFilterChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>25</span>
              <span>50g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}