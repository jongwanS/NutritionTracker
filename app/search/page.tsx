'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';
  
  // 필터 상태 관리
  const [filters, setFilters] = useState({
    calorieRange: searchParams.get('calorieRange') || '0',
    proteinRange: searchParams.get('proteinRange') || '0',
    carbsRange: searchParams.get('carbsRange') || '0',
    fatRange: searchParams.get('fatRange') || '0'
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // 검색 쿼리 생성
        let searchUrl = `/api/products?query=${encodeURIComponent(query)}`;
        
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
  }, [query, filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `"${query}" 검색 결과` : '모든 제품'}
      </h1>
      
      {loading ? (
        <div className="text-center p-12">
          <p className="text-gray-500">검색 결과를 불러오는 중...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product: any) => (
            <div 
              key={product.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.franchise}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">100g 당:</span> {product.calories} kcal
                </p>
                <p className="text-sm">단백질: {product.protein}g</p>
                <p className="text-sm">탄수화물: {product.carbs}g</p>
                <p className="text-sm">지방: {product.fat}g</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}