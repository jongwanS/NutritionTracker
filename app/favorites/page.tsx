'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../components/product-card';

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 즐겨찾기 목록 로드
    try {
      const storedFavorites = localStorage.getItem('favorites');
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(parsedFavorites);
      
      if (parsedFavorites.length > 0) {
        fetchFavoriteProducts(parsedFavorites);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('즐겨찾기 로드 오류:', err);
      setError('즐겨찾기 정보를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, []);

  async function fetchFavoriteProducts(favoriteIds: number[]) {
    try {
      setLoading(true);
      
      // 각 즐겨찾기 상품 정보 조회
      const productPromises = favoriteIds.map(id => 
        fetch(`/api/products/${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(err => {
            console.error(`상품 ID ${id} 조회 실패:`, err);
            return null;
          })
      );
      
      const products = await Promise.all(productPromises);
      const validProducts = products.filter(product => product !== null);
      setFavoriteProducts(validProducts);
    } catch (error) {
      console.error('즐겨찾기 상품 조회 오류:', error);
      setError('즐겨찾기 상품 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const removeFavorite = (productId: number) => {
    // 즐겨찾기에서 제거
    const newFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    
    // 목록에서도 제거
    setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
  };
  
  const clearAllFavorites = () => {
    // 모든 즐겨찾기 제거
    localStorage.setItem('favorites', JSON.stringify([]));
    setFavorites([]);
    setFavoriteProducts([]);
  };
  
  const navigateToProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">즐겨찾기</h1>
          <p className="text-gray-600">
            내가 저장한 메뉴 목록 ({favoriteProducts.length}개)
          </p>
        </div>
        
        {favoriteProducts.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${
                viewMode === 'grid' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              바둑판
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${
                viewMode === 'list' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              리스트
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="text-center p-12">
          <p className="text-gray-500">즐겨찾기 목록을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : favoriteProducts.length > 0 ? (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={clearAllFavorites}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              전체 즐겨찾기 삭제
            </button>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map(product => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 text-pink-600 shadow-sm hover:bg-pink-50"
                    title="즐겨찾기에서 제거"
                  >
                    ×
                  </button>
                  <div onClick={() => navigateToProduct(product.id)}>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteProducts.map(product => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-1 text-pink-600 shadow-sm hover:bg-pink-50"
                    title="즐겨찾기에서 제거"
                  >
                    ×
                  </button>
                  <div onClick={() => navigateToProduct(product.id)}>
                    <ProductCard product={product} listView={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">저장한 즐겨찾기가 없습니다.</p>
          <p className="text-gray-500 mt-2">
            제품 상세 페이지에서 별표(☆) 아이콘을 클릭하여 즐겨찾기에 추가할 수 있습니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}