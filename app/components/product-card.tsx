'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type ProductCardProps = {
  product: any;
  listView?: boolean;
};

export default function ProductCard({ product, listView = false }: ProductCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };
  
  const renderNutritionValue = (value: number | null) => {
    return value !== null ? value.toString() : "-";
  };
  
  if (listView) {
    return (
      <div 
        className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.franchise}</p>
          </div>
          
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">칼로리</p>
              <p className="font-medium">{renderNutritionValue(product.calories)} kcal</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">단백질</p>
              <p className="font-medium">{renderNutritionValue(product.protein)}g</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">탄수화물</p>
              <p className="font-medium">{renderNutritionValue(product.carbs)}g</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">지방</p>
              <p className="font-medium">{renderNutritionValue(product.fat)}g</p>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-right">
          <span>100g 당 영양성분</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <h3 className="font-semibold mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{product.franchise}</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm mt-auto">
        <div>
          <span className="text-gray-500">칼로리:</span>{' '}
          <span className="font-medium">{renderNutritionValue(product.calories)} kcal</span>
        </div>
        <div>
          <span className="text-gray-500">단백질:</span>{' '}
          <span className="font-medium">{renderNutritionValue(product.protein)}g</span>
        </div>
        <div>
          <span className="text-gray-500">탄수화물:</span>{' '}
          <span className="font-medium">{renderNutritionValue(product.carbs)}g</span>
        </div>
        <div>
          <span className="text-gray-500">지방:</span>{' '}
          <span className="font-medium">{renderNutritionValue(product.fat)}g</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <span>100g 당 영양성분</span>
      </div>
    </div>
  );
}