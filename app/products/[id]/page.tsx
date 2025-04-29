'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

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
        
        // 즐겨찾기 상태 로드
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
          setIsFavorite(parsedFavorites.includes(parseInt(id)));
        }
      } catch (error) {
        console.error('상품 상세 정보 조회 오류:', error);
        setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductDetails();
  }, [id]);

  const toggleFavorite = () => {
    const productId = parseInt(id);
    let newFavorites = [...favorites];
    
    if (isFavorite) {
      // 즐겨찾기 제거
      newFavorites = newFavorites.filter(fav => fav !== productId);
    } else {
      // 즐겨찾기 추가
      newFavorites.push(productId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setIsFavorite(!isFavorite);
  };
  
  const goBack = () => {
    router.back();
  };

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

  // 제품 중량이 있는 경우 영양소 총량 계산
  const calculateTotalNutrition = (valuePerHundredGrams: number | null, weight: number | null) => {
    if (!weight || valuePerHundredGrams === null) return "-";
    return ((valuePerHundredGrams * weight) / 100).toFixed(1);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-4 flex items-center">
        <button 
          onClick={goBack}
          className="text-pink-600 hover:text-pink-700 mr-4"
        >
          ← 돌아가기
        </button>
        <h1 className="text-xl sm:text-2xl font-bold flex-grow">{product.name}</h1>
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full ${
            isFavorite ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-pink-600'
          }`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="mb-4 pb-4 border-b">
          <p className="text-pink-600 font-medium">{product.franchise}</p>
          {product.categoryId && (
            <p className="text-sm text-gray-500">
              카테고리: {product.category || '기타'}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">영양성분 정보</h2>
          <div className="bg-pink-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-pink-800">
              기본 영양정보는 100g 당 기준입니다.
              {product.weight && product.weight > 0 && (
                <span className="font-medium"> 총 중량: {product.weight}g</span>
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-3 bg-gradient-to-br from-white to-pink-50">
              <p className="text-sm font-medium text-gray-600">칼로리</p>
              <p className="text-lg font-semibold">{product.calories || "-"} kcal / 100g</p>
              {product.weight && product.weight > 0 && (
                <p className="text-sm text-pink-600 mt-1">
                  총 {calculateTotalNutrition(product.calories, product.weight)} kcal
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3 bg-gradient-to-br from-white to-pink-50">
              <p className="text-sm font-medium text-gray-600">단백질</p>
              <p className="text-lg font-semibold">{product.protein || "-"} g / 100g</p>
              {product.weight && product.weight > 0 && (
                <p className="text-sm text-pink-600 mt-1">
                  총 {calculateTotalNutrition(product.protein, product.weight)} g
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3 bg-gradient-to-br from-white to-pink-50">
              <p className="text-sm font-medium text-gray-600">탄수화물</p>
              <p className="text-lg font-semibold">{product.carbs || "-"} g / 100g</p>
              {product.weight && product.weight > 0 && (
                <p className="text-sm text-pink-600 mt-1">
                  총 {calculateTotalNutrition(product.carbs, product.weight)} g
                </p>
              )}
            </div>
            
            <div className="border rounded-lg p-3 bg-gradient-to-br from-white to-pink-50">
              <p className="text-sm font-medium text-gray-600">지방</p>
              <p className="text-lg font-semibold">{product.fat || "-"} g / 100g</p>
              {product.weight && product.weight > 0 && (
                <p className="text-sm text-pink-600 mt-1">
                  총 {calculateTotalNutrition(product.fat, product.weight)} g
                </p>
              )}
            </div>
          </div>
          
          {/* 상세 영양 정보 (확장 가능) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-md font-semibold mb-3">상세 영양 정보</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div>
                <span className="text-gray-500">포화지방: </span>
                <span>{product.saturatedFat || "-"} g</span>
              </div>
              <div>
                <span className="text-gray-500">트랜스지방: </span>
                <span>{product.transFat || "-"} g</span>
              </div>
              <div>
                <span className="text-gray-500">콜레스테롤: </span>
                <span>{product.cholesterol || "-"} mg</span>
              </div>
              <div>
                <span className="text-gray-500">나트륨: </span>
                <span>{product.sodium || "-"} mg</span>
              </div>
              <div>
                <span className="text-gray-500">당류: </span>
                <span>{product.sugars || "-"} g</span>
              </div>
            </div>
          </div>
          
          {product.allergenDetails && product.allergenDetails.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">알레르기 정보</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergenDetails.map((allergen: any, index: number) => (
                  <span key={index} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs">
                    {allergen.nameKorean || allergen.name}
                  </span>
                ))}
              </div>
            </div>
          ) : product.allergens && product.allergens.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">알레르기 정보</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen: string, index: number) => (
                  <span key={index} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}