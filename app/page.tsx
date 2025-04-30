'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FilterBar from './components/filter-bar';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 필터 상태 관리
  const [filters, setFilters] = useState({
    calorieRange: '0',
    proteinRange: '0',
    carbsRange: '0',
    fatRange: '0'
  });

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        
        // 먼저 프랜차이즈 조회
        const franchisesResponse = await fetch('/api/franchises');
        if (!franchisesResponse.ok) {
          throw new Error('프랜차이즈 정보를 가져오는 데 실패했습니다.');
        }
        const franchisesData = await franchisesResponse.json();
        setFranchises(franchisesData);
        
        // 다음으로 카테고리 조회
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('카테고리 정보를 가져오는 데 실패했습니다.');
        }
        const categoriesData = await categoriesResponse.json();
        
        // 프랜차이즈가 있는 카테고리만 필터링
        const filteredCategories = categoriesData.filter((cat: any) => {
          return franchisesData.some((franchise: any) => franchise.categoryId === cat.id);
        });
        
        setCategories(filteredCategories);
      } catch (error) {
        console.error('초기 데이터 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/search?categoryId=${categoryId}`);
  };

  const handleFranchiseClick = (franchiseId: number) => {
    router.push(`/franchises/${franchiseId}`);
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: any) => {
    console.log('홈화면 필터 변경:', newFilters);
    setFilters(newFilters);
    
    // URL 파라미터에 필터 추가
    let filterParams = '';
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '0') {
        filterParams += filterParams ? '&' : '?';
        filterParams += `${key}=${encodeURIComponent(value as string)}`;
      }
    });
    
    // 이 시점에서는 필터링된 결과를 위한 API 호출이 필요 없습니다.
    // 사용자가 검색을 클릭할 때 필터 파라미터를 추가합니다.
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-10">
        <div className="bg-gradient-to-br from-pink-200 to-pink-100 rounded-xl p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            한국 프랜차이즈 영양정보
          </h1>
          <p className="text-gray-700 mb-6">
            한국 프랜차이즈 음식의 영양정보를 쉽게 검색하고 비교해보세요.
          </p>
          
          <form onSubmit={handleSearch} className="flex w-full mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="메뉴 또는 프랜차이즈 검색..."
              className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-r-lg hover:opacity-90 transition-opacity"
            >
              검색
            </button>
          </form>
          
          {/* 영양정보 필터 */}
          <div className="mb-3">
            <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>
        </div>
      </section>
      
      {loading ? (
        <div className="text-center p-12">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 카테고리 섹션 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">카테고리</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="aspect-square bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-sm hover:shadow-md hover:from-pink-50 hover:to-pink-100 transition-all cursor-pointer p-4 flex flex-col items-center justify-center text-center"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">{category.nameKorean || category.name}</div>
                </div>
              ))}
            </div>
          </section>
          
          {/* 인기 프랜차이즈 섹션 */}
          <section>
            <h2 className="text-xl font-bold mb-4">인기 프랜차이즈</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {franchises.slice(0, 10).map((franchise) => (
                <div
                  key={franchise.id}
                  className="aspect-square bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-sm hover:shadow-md hover:from-pink-50 hover:to-pink-100 transition-all cursor-pointer p-4 flex flex-col items-center justify-center text-center"
                  onClick={() => handleFranchiseClick(franchise.id)}
                >
                  <div className="text-lg font-semibold text-pink-600">{franchise.name}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}