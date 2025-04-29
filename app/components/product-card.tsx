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
      className="bg-white rounded-lg border p-1.5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <h3 className="font-medium text-xs line-clamp-1">{product.name}</h3>
      <p className="text-gray-600 text-[8px] mb-1">{product.franchise}</p>
      
      <table className="w-full text-[8px] border-collapse mt-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-0.5 px-1">성분</th>
            <th className="py-0.5 px-1">함량</th>
          </tr>
        </thead>
        <tbody className="font-normal">
          <tr className="border-t border-gray-100">
            <td className="py-0.5 px-1 text-gray-500">칼로리</td>
            <td className="py-0.5 px-1 text-right font-medium">{renderNutritionValue(product.calories)} kcal</td>
          </tr>
          <tr className="border-t border-gray-100">
            <td className="py-0.5 px-1 text-gray-500">단백질</td>
            <td className="py-0.5 px-1 text-right font-medium">{renderNutritionValue(product.protein)}g</td>
          </tr>
          <tr className="border-t border-gray-100">
            <td className="py-0.5 px-1 text-gray-500">탄수화물</td>
            <td className="py-0.5 px-1 text-right font-medium">{renderNutritionValue(product.carbs)}g</td>
          </tr>
          <tr className="border-t border-gray-100">
            <td className="py-0.5 px-1 text-gray-500">지방</td>
            <td className="py-0.5 px-1 text-right font-medium">{renderNutritionValue(product.fat)}g</td>
          </tr>
        </tbody>
      </table>
      
      <div className="mt-1 text-[8px] text-gray-500 text-center">
        <span>100g 당 영양성분</span>
      </div>
    </div>
  );
}