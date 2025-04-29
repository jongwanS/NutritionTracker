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
        className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer w-full"
        onClick={handleClick}
      >
        <div className="flex flex-col md:flex-row md:justify-between w-full">
          <div className="mb-3 md:mb-0 md:mr-4 md:flex-shrink-0 md:w-1/4">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.franchise}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">칼로리</p>
              <p className="font-medium">{renderNutritionValue(product.calories)} kcal</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">단백질</p>
              <p className="font-medium">{renderNutritionValue(product.protein)}g</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">탄수화물</p>
              <p className="font-medium">{renderNutritionValue(product.carbs)}g</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">지방</p>
              <p className="font-medium">{renderNutritionValue(product.fat)}g</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-right">
          <span>100g 당 영양성분</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="mb-2">
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">{product.name}</h3>
        <p className="text-gray-600 text-xs">{product.franchise}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <p className="text-[10px] text-gray-500">칼로리</p>
          <p className="font-medium truncate">{renderNutritionValue(product.calories)} kcal</p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <p className="text-[10px] text-gray-500">단백질</p>
          <p className="font-medium truncate">{renderNutritionValue(product.protein)}g</p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <p className="text-[10px] text-gray-500">탄수화물</p>
          <p className="font-medium truncate">{renderNutritionValue(product.carbs)}g</p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <p className="text-[10px] text-gray-500">지방</p>
          <p className="font-medium truncate">{renderNutritionValue(product.fat)}g</p>
        </div>
      </div>
      
      <div className="mt-2 text-[10px] text-gray-500 text-center">
        <span>100g 당 영양성분</span>
      </div>
    </div>
  );
}