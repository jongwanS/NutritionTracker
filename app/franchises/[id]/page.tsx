'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function FranchiseDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const productsResponse = await fetch(`/api/products?franchiseId=${id}`);
        if (!productsResponse.ok) {
          throw new Error('제품 목록을 가져오는 데 실패했습니다.');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('프랜차이즈 데이터 조회 오류:', error);
        setError('프랜차이즈 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFranchiseData();
  }, [id]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{franchise.name}</h1>
        {franchise.description && (
          <p className="text-gray-600">{franchise.description}</p>
        )}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">메뉴 목록</h2>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product: any) => (
            <div 
              key={product.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-sm text-gray-600">칼로리:</span>{' '}
                  <span className="font-medium">{product.calories || "-"} kcal</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">단백질:</span>{' '}
                  <span className="font-medium">{product.protein || "-"} g</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">탄수화물:</span>{' '}
                  <span className="font-medium">{product.carbs || "-"} g</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">지방:</span>{' '}
                  <span className="font-medium">{product.fat || "-"} g</span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                <span>100g 당 영양성분</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
        </div>
      )}
    </div>
  );
}