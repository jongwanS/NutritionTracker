'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '../../components/product-card';
import FilterBar from '../../components/filter-bar';

export default function FranchiseDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 필터 상태 관리
  const [filters, setFilters] = useState({
    calorieRange: '0',
    proteinRange: '0',
    carbsRange: '0',
    fatRange: '0'
  });

  useEffect(() => {
    async function fetchFranchiseData() {
      try {
        setLoading(true);
        
        if (!id) {
          setError('프랜차이즈 ID가 올바르지 않습니다.');
          return;
        }
        
        // 프랜차이즈 정보 조회
        const franchiseResponse = await fetch(`/api/franchises/${id}`);
        if (!franchiseResponse.ok) {
          throw new Error('프랜차이즈 정보를 가져오는 데 실패했습니다.');
        }
        const franchiseData = await franchiseResponse.json();
        setFranchise(franchiseData);
        
        // 프랜차이즈 제품 목록 조회
        const productsResponse = await fetch(`/api/search?franchiseId=${id}`);
        if (!productsResponse.ok) {
          throw new Error('제품 목록을 가져오는 데 실패했습니다.');
        }
        const productsData = await productsResponse.json();
        setAllProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('프랜차이즈 데이터 조회 오류:', error);
        setError('프랜차이즈 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFranchiseData();
  }, [id]);
  
  // 필터 변경 시 제품 필터링
  useEffect(() => {
    async function fetchFilteredProducts() {
      if (!franchise) return;
      
      setLoading(true);
      try {
        // API를 통한 서버 사이드 필터링
        let filterUrl = `/api/search?franchiseId=${id}`;
        
        // 필터 파라미터 추가
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '0') {
            filterUrl += `&${key}=${encodeURIComponent(value as string)}`;
          }
        });
        
        const response = await fetch(filterUrl);
        if (!response.ok) {
          throw new Error('필터링 결과를 가져오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        setFilteredProducts(data);
      } catch (error) {
        console.error('필터링 오류:', error);
        // 오류 발생 시 기존 데이터로 클라이언트 사이드 필터링 대체
        let results = [...allProducts];
        
        // 칼로리 필터
        if (filters.calorieRange !== '0') {
          const maxCalories = parseInt(filters.calorieRange);
          results = results.filter(product => 
            !product.calories || product.calories <= maxCalories
          );
        }
        
        // 단백질 필터 (특별 케이스: 이상 조건)
        if (filters.proteinRange !== '0') {
          const minProtein = parseInt(filters.proteinRange);
          results = results.filter(product => 
            product.protein && product.protein >= minProtein
          );
        }
        
        // 탄수화물 필터
        if (filters.carbsRange !== '0') {
          const maxCarbs = parseInt(filters.carbsRange);
          results = results.filter(product => 
            !product.carbs || product.carbs <= maxCarbs
          );
        }
        
        // 지방 필터
        if (filters.fatRange !== '0') {
          const maxFat = parseInt(filters.fatRange);
          results = results.filter(product => 
            !product.fat || product.fat <= maxFat
          );
        }
        
        setFilteredProducts(results);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFilteredProducts();
  }, [id, franchise, filters, allProducts]);
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">프랜차이즈 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !franchise) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error || '프랜차이즈 정보를 찾을 수 없습니다.'}</p>
          <button 
            onClick={goBack}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-4 flex items-center">
        <button 
          onClick={goBack}
          className="text-pink-600 hover:text-pink-700 mr-4"
        >
          ← 돌아가기
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{franchise.name}</h1>
      </div>
      
      {franchise.description && (
        <p className="text-gray-600 mb-6">{franchise.description}</p>
      )}
      
      {/* 모바일용 뷰 모드 전환 */}
      <div className="mb-4 lg:hidden">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-2 rounded flex justify-center items-center ${
                viewMode === 'grid' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              aria-label="바둑판식 보기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 rounded flex justify-center items-center ${
                viewMode === 'list' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              aria-label="리스트식 보기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 왼쪽 필터 영역 */}
        <div className="lg:col-span-1">
          <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
          
          {/* 데스크톱용 뷰 모드 전환 (모바일에서는 숨김) */}
          <div className="hidden lg:block bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">보기 방식</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 rounded flex justify-center items-center ${
                  viewMode === 'grid' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                aria-label="바둑판식 보기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 rounded flex justify-center items-center ${
                  viewMode === 'list' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                aria-label="리스트식 보기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 결과 영역 */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">메뉴 목록</h2>
          
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} listView={true} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {allProducts.length > 0 
                  ? '선택한 필터에 맞는 메뉴가 없습니다.' 
                  : '등록된 메뉴가 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}