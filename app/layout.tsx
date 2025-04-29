import type { Metadata } from 'next';
import '../client/src/index.css';

export const metadata: Metadata = {
  title: '영양 트래커 - 한국 프랜차이즈 메뉴 영양성분 정보',
  description: '한국 프랜차이즈 메뉴의 정확한 영양성분 정보 제공 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}