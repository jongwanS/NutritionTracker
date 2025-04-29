import React from 'react';

interface AdProps {
  className?: string;
}

// 광고 컴포넌트를 비워서 공간만 차지하도록 수정
// 구글 애드센스가 자동으로 페이지에 광고를 배치하도록 하기 위함

/**
 * GoogleAd 컴포넌트 - 광고를 위한 빈 공간입니다.
 */
export function GoogleAd({ className }: AdProps) {
  // 아무것도 렌더링하지 않음
  return null;
}

/**
 * InArticleAd 컴포넌트 - 콘텐츠 중간에 삽입되는 광고를 위한 빈 공간입니다.
 */
export function InArticleAd({ className }: AdProps) {
  return null;
}

/**
 * SidebarAd 컴포넌트 - 사이드바에 표시되는 세로형 광고를 위한 빈 공간입니다.
 */
export function SidebarAd({ className }: AdProps) {
  return null;
}

/**
 * BannerAd 컴포넌트 - 페이지 상단/하단에 표시되는 가로형 배너 광고를 위한 빈 공간입니다.
 */
export function BannerAd({ className }: AdProps) {
  return null;
}

/**
 * ResponsiveAd 컴포넌트 - 반응형 광고를 위한 빈 공간입니다.
 */
export function ResponsiveAd({ className }: AdProps) {
  return null;
}