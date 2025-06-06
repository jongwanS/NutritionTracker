'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilterBar from '../../components/filter-bar';
import ProductCard from '../../components/product-card';

export default function CategoryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [category, setCategory] = useState<any>(null);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
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
    async function fetchCategoryData() {
      try {
        setLoading(true);
        
        if (!id) {
          setError('카테고리 ID가 올바르지 않습니다.');
          return;
        }
        
        // 카테고리 정보 조회
        const categoryResponse = await fetch(`/api/categories/${id}`);
        if (!categoryResponse.ok) {
          throw new Error('카테고리 정보를 가져오는 데 실패했습니다.');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
        
        // 카테고리 관련 프랜차이즈 목록 조회
        const franchisesResponse = await fetch(`/api/franchises?categoryId=${id}`);
        if (!franchisesResponse.ok) {
          throw new Error('프랜차이즈 목록을 가져오는 데 실패했습니다.');
        }
        const franchisesData = await franchisesResponse.json();
        setFranchises(franchisesData);
        
        // 카테고리 제품 목록 조회
        const productsResponse = await fetch(`/api/products?categoryId=${id}`);
        if (!productsResponse.ok) {
          throw new Error('제품 목록을 가져오는 데 실패했습니다.');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('카테고리 데이터 조회 오류:', error);
        setError('카테고리 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategoryData();
  }, [id]);
  
  // 필터 변경 시 제품 필터링
  useEffect(() => {
    if (!products.length) return;
    
    // 클라이언트 사이드에서 필터링
    let results = [...products];
    
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
  }, [products, filters]);
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const handleFranchiseClick = (franchiseId: number) => {
    router.push(`/franchises/${franchiseId}`);
  };
  
  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">카테고리 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error || '카테고리 정보를 찾을 수 없습니다.'}</p>
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
        <h1 className="text-xl sm:text-2xl font-bold">
          {category.nameKorean || category.name}
        </h1>
      </div>
      
      {/* 프랜차이즈 섹션 */}
      {franchises.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">프랜차이즈</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {franchises.map(franchise => (
              <div
                key={franchise.id}
                className="aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 flex flex-col items-center justify-center text-center"
                onClick={() => handleFranchiseClick(franchise.id)}
              >
                <div className="text-lg font-semibold">{franchise.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 제품 섹션 */}
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
          <h2 className="text-xl font-semibold mb-4">메뉴 목록</h2>
          
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {products.length > 0 
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