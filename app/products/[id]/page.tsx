'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        
        if (!id) {
          setError('상품 ID가 올바르지 않습니다.');
          return;
        }
        
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('상품 정보를 가져오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('상품 상세 정보 조회 오류:', error);
        setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error || '상품 정보를 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  // 제품 중량이 있는 경우 영양소 총량 계산
  const calculateTotalNutrition = (valuePerHundredGrams: number, weight: number | null) => {
    if (!weight) return "-";
    return ((valuePerHundredGrams * weight) / 100).toFixed(1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.franchise}</p>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">영양성분 정보</h2>
          <p className="text-sm text-gray-500 mb-4">
            기본 영양정보는 100g 당 기준입니다.
            {product.weight && (
              <span> 총 중량: {product.weight}g</span>
            )}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-3">
              <p className="text-sm font-medium">칼로리</p>
              <p className="text-lg">{product.calories || "-"} kcal / 100g</p>
              {product.weight && (
                <p className="text-sm text-gray-600">
                  총 {calculateTotalNutrition(product.calories, product.weight)} kcal
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3">
              <p className="text-sm font-medium">단백질</p>
              <p className="text-lg">{product.protein || "-"} g / 100g</p>
              {product.weight && (
                <p className="text-sm text-gray-600">
                  총 {calculateTotalNutrition(product.protein, product.weight)} g
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3">
              <p className="text-sm font-medium">탄수화물</p>
              <p className="text-lg">{product.carbs || "-"} g / 100g</p>
              {product.weight && (
                <p className="text-sm text-gray-600">
                  총 {calculateTotalNutrition(product.carbs, product.weight)} g
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3">
              <p className="text-sm font-medium">지방</p>
              <p className="text-lg">{product.fat || "-"} g / 100g</p>
              {product.weight && (
                <p className="text-sm text-gray-600">
                  총 {calculateTotalNutrition(product.fat, product.weight)} g
                </p>
              )}
            </div>
          </div>
          
          {product.allergens && product.allergens.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">알레르기 정보</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen: string, index: number) => (
                  <span key={index} className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}