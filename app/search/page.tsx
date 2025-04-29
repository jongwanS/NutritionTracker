'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '../components/filter-bar';
import ProductCard from '../components/product-card';

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 검색 파라미터 추출
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId');
  
  // 필터 상태 관리
  const [filters, setFilters] = useState({
    calorieRange: searchParams.get('calorieRange') || '0',
    proteinRange: searchParams.get('proteinRange') || '0',
    carbsRange: searchParams.get('carbsRange') || '0',
    fatRange: searchParams.get('fatRange') || '0'
  });
  
  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // 검색 쿼리 생성
        let searchUrl = `/api/products?query=${encodeURIComponent(query)}`;
        
        // 카테고리 파라미터 추가
        if (categoryId) {
          searchUrl += `&categoryId=${encodeURIComponent(categoryId)}`;
        }
        
        // 필터 파라미터 추가
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '0') {
            searchUrl += `&${key}=${encodeURIComponent(value as string)}`;
          }
        });
        
        const response = await fetch(searchUrl);
        if (!response.ok) {
          throw new Error('검색 결과를 가져오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('검색 오류:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [query, categoryId, filters]);

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // URL 업데이트 (선택사항)
    // const searchParams = new URLSearchParams(window.location.search);
    // Object.entries(newFilters).forEach(([key, value]) => {
    //   if (value && value !== '0') {
    //     searchParams.set(key, value as string);
    //   } else {
    //     searchParams.delete(key);
    //   }
    // });
    // const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    // window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // 결과 제목 생성
  const getResultTitle = () => {
    if (query) {
      return `"${query}" 검색 결과`;
    } else if (categoryId) {
      return '카테고리 검색 결과';
    } else {
      return '모든 제품';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex w-full mb-4">
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
        
        <h1 className="text-2xl font-bold">
          {getResultTitle()}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 왼쪽 필터 영역 */}
        <div className="lg:col-span-1">
          <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
          
          {/* 뷰 모드 전환 */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">보기 방식</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 rounded ${
                  viewMode === 'grid' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                바둑판
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 rounded ${
                  viewMode === 'list' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                리스트
              </button>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 결과 영역 */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center p-12">
              <p className="text-gray-500">검색 결과를 불러오는 중...</p>
            </div>
          ) : products.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} listView={true} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}