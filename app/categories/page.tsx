'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('카테고리 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 조회 오류:', error);
        setError('카테고리 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">카테고리</h1>
        <p className="text-gray-600">
          다양한 음식 카테고리별로 살펴보세요
        </p>
      </div>
      
      {loading ? (
        <div className="text-center p-12">
          <p className="text-gray-500">카테고리 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 flex flex-col items-center justify-center text-center"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="text-lg font-semibold">
                {category.nameKorean || category.name}
              </div>
              {category.description && (
                <p className="text-sm text-gray-500 mt-2">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">등록된 카테고리가 없습니다.</p>
        </div>
      )}
    </div>
  );
}