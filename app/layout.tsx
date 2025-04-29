import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '한국 프랜차이즈 영양정보',
  description: '한국 프랜차이즈 음식의 영양정보를 쉽게 검색하고 비교해보세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <header className="border-b px-4 py-3 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <a 
              href="/" 
              className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              K-Nutrition
            </a>
            
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a 
                    href="/" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    홈
                  </a>
                </li>
                <li>
                  <a 
                    href="/categories" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    카테고리
                  </a>
                </li>
                <li>
                  <a 
                    href="/search" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    검색
                  </a>
                </li>
                <li>
                  <a 
                    href="/favorites" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    즐겨찾기
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer className="bg-gray-50 border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} K-Nutrition - 한국 프랜차이즈 영양정보</p>
            <p className="mt-2">
              모든 영양정보는 공식 자료를 기반으로 합니다. 100g 당 영양정보를 제공합니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}