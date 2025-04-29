import fs from 'fs';
import path from 'path';
import { Product, Franchise, Category, Allergen } from '@shared/schema';

export interface KoreanFoodItem {
  식품코드: string;
  식품명: string;
  데이터구분코드: string;
  데이터구분명: string;
  식품기원코드: number;
  식품기원명: string;
  식품대분류코드: number;
  식품대분류명: string;
  대표식품코드: number;
  대표식품명: string;
  식품중분류코드: number;
  식품중분류명: string;
  식품소분류코드: number;
  식품소분류명: string;
  식품세분류코드: number;
  식품세분류명: string;
  영양성분함량기준량: string;
  식품중량?: string; // 추가: 선택적 필드로 식품 중량 정보
  '에너지(kcal)': number;
  '수분(g)': number | null;
  '단백질(g)': number;
  '지방(g)': number;
  '회분(g)': number | null;
  '탄수화물(g)': number;
  '당류(g)': number;
  '식이섬유(g)': number | null;
  '칼슘(mg)': number | null;
  '철(mg)': number | null;
  '인(mg)': number | null;
  '칼륨(mg)': number | null;
  '나트륨(mg)': number;
  '비타민 A(μg RAE)': number | null;
  '레티놀(μg)': number | null;
  '베타카로틴(μg)': number | null;
  '티아민(mg)': number | null;
  '리보플라빈(mg)': number | null;
  '니아신(mg)': number | null;
  '비타민 C(mg)': number | null;
  '비타민 D(μg)': number | null;
  '콜레스테롤(mg)': number;
  '포화지방산(g)': number;
  '트랜스지방산(g)': number;
}

// 카테고리 목록 (하드코딩)
const categories: Category[] = [
  { id: 1, name: "Burger", nameKorean: "버거", imageUrl: "" },
  { id: 2, name: "Chicken", nameKorean: "치킨", imageUrl: "" },
  { id: 3, name: "Pizza", nameKorean: "피자", imageUrl: "" },
  { id: 4, name: "Coffee/Drinks", nameKorean: "커피/음료", imageUrl: "" },
  { id: 5, name: "Dessert", nameKorean: "디저트/베이커리", imageUrl: "" },
  { id: 6, name: "Korean", nameKorean: "한식", imageUrl: "" },
  { id: 7, name: "Japanese", nameKorean: "일식", imageUrl: "" },
  { id: 8, name: "Chinese", nameKorean: "중식", imageUrl: "" },
  { id: 9, name: "Tea/Bubble Tea", nameKorean: "차/밀크티", imageUrl: "" },
  { id: 10, name: "Waffle/Toast", nameKorean: "와플/토스트", imageUrl: "" },
  { id: 11, name: "Meal Kit", nameKorean: "밀키트", imageUrl: "" },
  { id: 12, name: "Smoothie/Juice", nameKorean: "스무디/주스", imageUrl: "" },
  { id: 13, name: "Snack", nameKorean: "분식", imageUrl: "" },
  { id: 14, name: "Western", nameKorean: "양식", imageUrl: "" },
  { id: 15, name: "Nuts", nameKorean: "견과류", imageUrl: "" }
];

// 알러젠 목록 (하드코딩)
const allergens: Allergen[] = [
  { id: 1, name: "Wheat", nameKorean: "밀" },
  { id: 2, name: "Milk", nameKorean: "유제품" },
  { id: 3, name: "Eggs", nameKorean: "계란" },
  { id: 4, name: "Fish", nameKorean: "생선" },
  { id: 5, name: "Shellfish", nameKorean: "조개류" },
  { id: 6, name: "Peanuts", nameKorean: "땅콩" },
  { id: 7, name: "Tree Nuts", nameKorean: "견과류" },
  { id: 8, name: "Soy", nameKorean: "대두" }
];

// 프랜차이즈 정보 매핑
const franchiseMap: { [key: string]: { id: number, categoryId: number, logoUrl: string } } = {
  // 1. 버거 카테고리
  "맥도날드": { id: 1, categoryId: 1, logoUrl: "" },
  "버거킹": { id: 2, categoryId: 1, logoUrl: "" },
  "롯데리아": { id: 3, categoryId: 1, logoUrl: "" },
  "KFC": { id: 4, categoryId: 1, logoUrl: "" },
  "맘스터치": { id: 5, categoryId: 1, logoUrl: "" },
  "노브랜드버거": { id: 6, categoryId: 1, logoUrl: "" },
  "프랭크버거": { id: 7, categoryId: 1, logoUrl: "" },
  "앤티앤스": { id: 8, categoryId: 1, logoUrl: "" },
  
  // 2. 치킨 카테고리
  "BBQ": { id: 9, categoryId: 2, logoUrl: "" },
  "교촌치킨": { id: 10, categoryId: 2, logoUrl: "" },
  "굽네치킨": { id: 11, categoryId: 2, logoUrl: "" },
  "호식이두마리치킨": { id: 12, categoryId: 2, logoUrl: "" },
  "치킨플러스": { id: 13, categoryId: 2, logoUrl: "" },
  "자담치킨": { id: 14, categoryId: 2, logoUrl: "" },
  "또래오래": { id: 15, categoryId: 2, logoUrl: "" },
  "멕시카나": { id: 16, categoryId: 2, logoUrl: "" },
  
  // 3. 피자 카테고리
  "도미노피자": { id: 18, categoryId: 3, logoUrl: "" },
  "피자헛": { id: 19, categoryId: 3, logoUrl: "" },
  "미스터피자": { id: 20, categoryId: 3, logoUrl: "" },
  "파파존스": { id: 21, categoryId: 3, logoUrl: "" },
  "피자알볼로": { id: 22, categoryId: 3, logoUrl: "" },
  "피자마루": { id: 23, categoryId: 3, logoUrl: "" },
  "피자스쿨": { id: 24, categoryId: 3, logoUrl: "" },
  "청년피자": { id: 25, categoryId: 3, logoUrl: "" },
  "임실N치즈피자": { id: 26, categoryId: 3, logoUrl: "" },
  "7번가피자": { id: 27, categoryId: 3, logoUrl: "" },
  "피자나라치킨공주": { id: 28, categoryId: 3, logoUrl: "" },
  "피자에땅": { id: 29, categoryId: 3, logoUrl: "" },
  
  // 4. 커피/음료 카테고리
  "스타벅스": { id: 30, categoryId: 4, logoUrl: "" },
  "투썸플레이스": { id: 31, categoryId: 4, logoUrl: "" },
  "이디야": { id: 32, categoryId: 4, logoUrl: "" },
  "메가커피": { id: 33, categoryId: 4, logoUrl: "" },
  "빽다방": { id: 34, categoryId: 4, logoUrl: "" },
  "커피빈": { id: 35, categoryId: 4, logoUrl: "" },
  "할리스": { id: 36, categoryId: 4, logoUrl: "" },
  "더벤티": { id: 37, categoryId: 4, logoUrl: "" },
  "컴포즈커피": { id: 38, categoryId: 4, logoUrl: "" },
  "엔제리너스": { id: 39, categoryId: 4, logoUrl: "" },
  "파스쿠찌": { id: 40, categoryId: 4, logoUrl: "" },
  "드롭탑": { id: 41, categoryId: 4, logoUrl: "" },
  "탐앤탐스": { id: 42, categoryId: 4, logoUrl: "" },
  "매머드 익스프레스": { id: 43, categoryId: 4, logoUrl: "" },
  "토프레소": { id: 44, categoryId: 4, logoUrl: "" },
  "더리터": { id: 45, categoryId: 4, logoUrl: "" },
  "바나프레소": { id: 46, categoryId: 4, logoUrl: "" },
  "블루샥": { id: 47, categoryId: 4, logoUrl: "" },
  
  // 5. 디저트/베이커리 카테고리
  "파리바게뜨": { id: 48, categoryId: 5, logoUrl: "" },
  "뚜레쥬르": { id: 49, categoryId: 5, logoUrl: "" },
  "던킨도너츠": { id: 50, categoryId: 5, logoUrl: "" },
  "크리스피크림도넛": { id: 51, categoryId: 5, logoUrl: "" },
  "배스킨라빈스": { id: 52, categoryId: 5, logoUrl: "" },
  "디저트39": { id: 53, categoryId: 5, logoUrl: "" },
  "크로플덕오리아가씨": { id: 54, categoryId: 5, logoUrl: "" },
  "망원동티라미수": { id: 55, categoryId: 5, logoUrl: "" },
  "롤링핀": { id: 56, categoryId: 5, logoUrl: "" },
  "크라상점": { id: 57, categoryId: 5, logoUrl: "" },
  "못난이꽈배기": { id: 58, categoryId: 5, logoUrl: "" },
  "요거트아이스크림의 정석": { id: 59, categoryId: 5, logoUrl: "" },
  "스트릿츄러스": { id: 60, categoryId: 5, logoUrl: "" },
  "로띠번": { id: 61, categoryId: 5, logoUrl: "" },
  "비토랩": { id: 62, categoryId: 5, logoUrl: "" },
  
  // 9. 차/밀크티 카테고리
  "공차": { id: 63, categoryId: 9, logoUrl: "" },
  "팔공티": { id: 64, categoryId: 9, logoUrl: "" },
  "따삐오": { id: 65, categoryId: 9, logoUrl: "" },
  "달콤": { id: 66, categoryId: 9, logoUrl: "" },
  
  // 10. 와플/토스트 카테고리
  "와플대학": { id: 67, categoryId: 10, logoUrl: "" },
  "베러댄와플": { id: 68, categoryId: 10, logoUrl: "" },
  "와플칸": { id: 69, categoryId: 10, logoUrl: "" },
  
  // 11. 밀키트 카테고리
  "CJ 쿡킷": { id: 70, categoryId: 11, logoUrl: "" },
  "GS 리테일 심플리쿡": { id: 71, categoryId: 11, logoUrl: "" },
  "HY 잇츠온": { id: 72, categoryId: 11, logoUrl: "" },
  "신세계푸드 피코크": { id: 73, categoryId: 11, logoUrl: "" },
  
  // 12. 스무디/주스 카테고리
  "스무디킹": { id: 74, categoryId: 12, logoUrl: "" },
  "마이요거트립": { id: 75, categoryId: 12, logoUrl: "" },
  "요거프레소": { id: 76, categoryId: 12, logoUrl: "" },
  "아임일리터": { id: 77, categoryId: 12, logoUrl: "" },
  
  // 13. 분식 카테고리
  "송사부수제쌀고로케": { id: 78, categoryId: 13, logoUrl: "" },
  "마리웨일237": { id: 79, categoryId: 13, logoUrl: "" },
  "츄러스1500": { id: 80, categoryId: 13, logoUrl: "" },
  
  // 15. 견과류 카테고리
  "코코호도": { id: 81, categoryId: 15, logoUrl: "" },
  "호밀호두": { id: 82, categoryId: 15, logoUrl: "" }
};

// 프랜차이즈 정보 생성
const franchises: Franchise[] = Object.entries(franchiseMap).map(([name, data]) => ({
  id: data.id,
  name,
  categoryId: data.categoryId,
  logoUrl: data.logoUrl
}));

// 제품 데이터 캐시
let cachedProducts: Map<number, Product> = new Map();
let initialized = false;

// 제품 데이터 로드
export async function loadProductData(): Promise<Product[]> {
  // 이미 초기화되었으면 캐시에서 반환
  if (initialized) {
    return Array.from(cachedProducts.values());
  }

  try {
    const franchiseDir = path.resolve('./seller/franchise');
    const franchiseFiles = fs.readdirSync(franchiseDir);
    let productId = 1;
    
    // 메뉴 데이터 로드
    for (const franchiseFile of franchiseFiles) {
      if (!franchiseFile.endsWith('.json')) continue;
      
      const franchiseName = franchiseFile.replace('.json', '');
      const franchiseInfo = franchiseMap[franchiseName];
      
      // 매핑된 프랜차이즈만 처리
      if (!franchiseInfo) continue;
      
      const filePath = path.join(franchiseDir, franchiseFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const menuItems: KoreanFoodItem[] = JSON.parse(fileContent);
      
      console.log(`로드 중: ${franchiseName} - ${menuItems.length}개 항목`);
      
      // 메뉴 항목 처리
      for (const item of menuItems) {
        // 식품명에서 카테고리 제거 (예: "버거_빅맥" -> "빅맥")
        const nameParts = item.식품명.split('_');
        const productCategory = nameParts[0] || '';
        
        // 밀키트 제품의 경우 세 번째 부분을 제품명으로 사용 (예: "칼국수_간편조리세트_닭한마리와 칼국수" -> "닭한마리와 칼국수")
        let productName;
        if (nameParts.length > 2 && nameParts[1] === '간편조리세트') {
          productName = nameParts[2];
        } else {
          productName = nameParts.length > 1 ? nameParts[1] : item.식품명;
        }
        
        // 카테고리 ID 결정 (명시적 카테고리 매핑)
        let categoryId = franchiseInfo.categoryId; // 기본값은 프랜차이즈 카테고리
        
        // 제품명이나 카테고리명에 따라 카테고리 자동 분류
        if (productCategory.includes('버거') || 
            productName.toLowerCase().includes('버거') || 
            productName.toLowerCase().includes('와퍼') ||
            productName.toLowerCase().includes('불고기') ||
            franchiseName === 'KFC') {
          categoryId = 1; // 버거 카테고리
        } else if (productCategory.includes('치킨') || 
                  productName.toLowerCase().includes('치킨') || 
                  productName.toLowerCase().includes('윙') ||
                  productName.toLowerCase().includes('봉')) {
          categoryId = 2; // 치킨 카테고리
        } else if (productCategory.includes('피자') || 
                  productName.toLowerCase().includes('피자')) {
          categoryId = 3; // 피자 카테고리
        } else if (productCategory.includes('커피') || 
                  productCategory.includes('음료') ||
                  productName.toLowerCase().includes('커피') ||
                  productName.toLowerCase().includes('라떼') ||
                  productName.toLowerCase().includes('에스프레소') ||
                  productName.toLowerCase().includes('아메리카노')) {
          categoryId = 4; // 커피/음료 카테고리
        } else if (productCategory.includes('디저트') || 
                  productCategory.includes('케이크') ||
                  productName.toLowerCase().includes('케이크') ||
                  productName.toLowerCase().includes('쿠키') ||
                  productName.toLowerCase().includes('마카롱') ||
                  productName.toLowerCase().includes('빵') ||
                  productName.toLowerCase().includes('페이스트리') ||
                  productName.toLowerCase().includes('크림') ||
                  productName.toLowerCase().includes('티라미수') ||
                  productName.toLowerCase().includes('아이스크림')) {
          categoryId = 5; // 디저트 카테고리
        } else if (productCategory.includes('국') || 
                  productCategory.includes('찌개') ||
                  productCategory.includes('비빔밥') ||
                  productName.toLowerCase().includes('비빔밥') ||
                  productName.toLowerCase().includes('김치') ||
                  productName.toLowerCase().includes('된장') ||
                  productName.toLowerCase().includes('찌개') ||
                  productName.toLowerCase().includes('국밥')) {
          categoryId = 6; // 한식 카테고리
        } else if (productCategory.includes('초밥') || 
                  productCategory.includes('우동') ||
                  productName.toLowerCase().includes('초밥') ||
                  productName.toLowerCase().includes('스시') ||
                  productName.toLowerCase().includes('우동') ||
                  productName.toLowerCase().includes('돈까스')) {
          categoryId = 7; // 일식 카테고리
        } else if (productCategory.includes('짜장') || 
                  productCategory.includes('짬뽕') ||
                  productName.toLowerCase().includes('짜장') ||
                  productName.toLowerCase().includes('짬뽕') ||
                  productName.toLowerCase().includes('탕수육')) {
          categoryId = 8; // 중식 카테고리
        } else if (productCategory.includes('차') || 
                  productCategory.includes('티') ||
                  productName.toLowerCase().includes('밀크티') ||
                  productName.toLowerCase().includes('버블티') ||
                  productName.toLowerCase().includes('녹차') ||
                  productName.toLowerCase().includes('홍차')) {
          categoryId = 9; // 차/밀크티 카테고리
        } else if (productCategory.includes('와플') || 
                  productCategory.includes('토스트') ||
                  productName.toLowerCase().includes('와플') ||
                  productName.toLowerCase().includes('토스트')) {
          categoryId = 10; // 와플/토스트 카테고리
        } else if (productCategory.includes('밀키트') || 
                  productName.toLowerCase().includes('밀키트') ||
                  productName.toLowerCase().includes('쿡킷') ||
                  franchiseName.includes('쿡킷') ||
                  franchiseName.includes('심플리쿡') ||
                  franchiseName.includes('잇츠온') ||
                  franchiseName.includes('피코크')) {
          categoryId = 11; // 밀키트 카테고리
        } else if (productCategory.includes('스무디') || 
                  productCategory.includes('주스') ||
                  productName.toLowerCase().includes('스무디') ||
                  productName.toLowerCase().includes('주스') ||
                  productName.toLowerCase().includes('요거트')) {
          categoryId = 12; // 스무디/주스 카테고리
        } else if (productCategory.includes('떡볶이') || 
                  productCategory.includes('고로케') ||
                  productName.toLowerCase().includes('떡볶이') ||
                  productName.toLowerCase().includes('고로케') ||
                  productName.toLowerCase().includes('핫도그') ||
                  productName.toLowerCase().includes('김밥')) {
          categoryId = 13; // 분식 카테고리
        } else if (productCategory.includes('파스타') || 
                  productCategory.includes('스테이크') ||
                  productName.toLowerCase().includes('파스타') ||
                  productName.toLowerCase().includes('스테이크') ||
                  productName.toLowerCase().includes('리조또')) {
          categoryId = 14; // 양식 카테고리
        } else if (productCategory.includes('호두') || 
                  productCategory.includes('땅콩') ||
                  productName.toLowerCase().includes('호두') ||
                  productName.toLowerCase().includes('땅콩') ||
                  productName.toLowerCase().includes('견과')) {
          categoryId = 15; // 견과류 카테고리
        }
        
        // 이미지 URL은 빈 문자열로 설정
        let imageUrl = "";
        
        // 알러젠 임의 할당 (실제 데이터에 따라 조정 필요)
        const allergenIds: number[] = [];
        if (productCategory.includes('버거') || productCategory.includes('샌드위치')) {
          allergenIds.push(1, 2, 8); // 밀, 유제품, 대두
        }
        if (productName.toLowerCase().includes('치즈')) {
          allergenIds.push(2); // 유제품
        }
        if (productName.toLowerCase().includes('에그')) {
          allergenIds.push(3); // 계란
        }
        
        // 중복 제거
        const uniqueAllergens = Array.from(new Set(allergenIds));
        
        // 제품 무게 계산 (g 단위)
        // 카테고리별 평균 중량 - 사용자가 제공한 데이터 기준
        let productWeight = 0;
        
        // 카테고리 ID에 따른 무게 설정 (실제 제품 기준)
        switch (categoryId) {
          case 1: // 버거
            productWeight = 250; // 버거 평균 무게 (g)
            break;
          case 2: // 치킨
            productWeight = 200; // 치킨류 평균 무게 (g)
            break;
          case 3: // 피자
            productWeight = 300; // 피자 슬라이스 평균 무게 (g)
            break;
          case 4: // 커피/음료
            productWeight = 350; // 음료 평균 무게 (mL)
            break;
          case 5: // 디저트
            productWeight = 120; // 디저트류 평균 무게 (g)
            break;
          default:
            // 제품 이름에 따른 일반적인 무게
            if (productName.includes('샌드위치')) {
              productWeight = 220; // 샌드위치 평균 무게 (g)
            } else if (productName.includes('버거')) {
              productWeight = 250; // 버거 키워드 포함시
            } else if (productName.includes('볶음밥')) {
              productWeight = 300; // 볶음밥 키워드 포함시
            } else if (productName.includes('치킨')) {
              productWeight = 200; // 치킨 키워드 포함시
            } else {
              productWeight = 200; // 기본 무게 (g)
            }
        }
        
        // 개인화된 무게 데이터 (특정 제품에 대해 무게 정보가 있는 경우)
        if (franchiseName === '교촌치킨' && productName.includes('달걀듬뿍 볶음밥')) {
          productWeight = 400; // 실제 교촌치킨 달걀듬뿍 볶음밥 무게 (g)
        } else if (franchiseName === '교촌치킨' && productName.includes('닭갈비 볶음밥')) {
          productWeight = 400; // 실제 교촌치킨 닭갈비 볶음밥 무게 (g)
        } else if (franchiseName === '교촌치킨' && productName.includes('의성마늘 볶음밥')) {
          productWeight = 400; // 실제 교촌치킨 의성마늘 볶음밥 무게 (g)
        } else if (franchiseName === '맘스터치' && productName.includes('간장마늘싸이 버거')) {
          productWeight = 250; // 맘스터치 간장마늘싸이 버거 무게 (g)
        }

        // 원본 데이터 그대로 사용 (100g 당 영양성분 정보)
        // 총 지방 계산 로직: 총 지방이 null이고 포화지방이 있으면 포화지방으로 총 지방 추정
        let totalFat = Number(item['지방(g)']) || 0;
        const saturatedFat = item['포화지방산(g)'] ? Number(item['포화지방산(g)']) : null;
        
        // 총 지방이 없지만 포화지방이 있는 경우, 포화지방을 기준으로 총 지방을 추정 (포화지방은 총 지방의 일부)
        if ((!totalFat || isNaN(totalFat)) && saturatedFat) {
          // 포화지방이 총 지방의 약 30-50%를 차지한다고 가정하고 계산
          totalFat = Math.round(saturatedFat * 2 * 10) / 10; // 포화지방의 2배로 추정
        }
        
        // 원본 데이터 그대로 사용 (100g 당 영양성분 정보)
        const caloriesTotal = Number(item['에너지(kcal)']) || 0;
        const proteinTotal = Number(item['단백질(g)']) || 0;
        const carbsTotal = item['탄수화물(g)'] ? Number(item['탄수화물(g)']) : 0;
        const fatTotal = totalFat;
        const saturatedFatTotal = saturatedFat;
        const transFatTotal = item['트랜스지방산(g)'] ? Number(item['트랜스지방산(g)']) : null;
        const cholesterolTotal = item['콜레스테롤(mg)'] ? Number(item['콜레스테롤(mg)']) : null;
        const sodiumTotal = item['나트륨(mg)'] ? Number(item['나트륨(mg)']) : null;
        const sugarTotal = item['당류(g)'] ? Number(item['당류(g)']) : null;
        
        // 제품 중량 정보 추출 (있는 경우에만)
        let extractedWeight = null;
        
        // 개인화된 무게 데이터 먼저 확인 (특정 제품에 대해 수동으로 설정된 경우)
        if (franchiseName === '맘스터치' && productName.includes('간장마늘싸이 버거')) {
          extractedWeight = 250; // 맘스터치 간장마늘싸이 버거 무게 (g)
        } else if (franchiseName === '교촌치킨' && (
          productName.includes('달걀듬뿍 볶음밥') ||
          productName.includes('닭갈비 볶음밥') ||
          productName.includes('의성마늘 볶음밥')
        )) {
          extractedWeight = 400; // 교촌치킨 볶음밥 무게 (g)
        }
        
        // 수동으로 무게가 설정되지 않은 경우, 데이터에서 추출 시도
        if (!extractedWeight) {
          // 1. 먼저 식품중량 필드에서 바로 추출 시도 (타입 처리)
          if (typeof item['식품중량'] === 'string') {
            const weightMatch = item['식품중량'].match(/(\d+)g/i);
            if (weightMatch) {
              extractedWeight = parseInt(weightMatch[1]);
              console.log(`중량 추출 성공 (식품중량): ${productName} - ${extractedWeight}g`);
            }
          }
          
          // 2. 식품중량에서 추출 실패 시 다른 필드 확인
          if (!extractedWeight) {
            // 제품명이나 JSON 데이터에서 중량 정보 추출 시도
            const weightMatch = productName.match(/(\d+)g/i) || 
                              JSON.stringify(item).match(/중량[:\s]*(\d+)g/i) ||
                              JSON.stringify(item).match(/무게[:\s]*(\d+)g/i) ||
                              item['영양성분함량기준량']?.match(/(\d+)g/i);
            
            if (weightMatch) {
              extractedWeight = parseInt(weightMatch[1]);
              console.log(`중량 추출 성공 (기타): ${productName} - ${extractedWeight}g`);
            }
          }
        }
        
        const description = extractedWeight 
          ? `${franchiseName}의 ${productName} 메뉴입니다. (영양성분: 전체 ${extractedWeight}g 기준)`
          : `${franchiseName}의 ${productName} 메뉴입니다. (영양성분: 100g 기준)`;
        
        // 제품 정보 생성
        const product: Product = {
          id: productId++,
          name: productName,
          franchiseId: franchiseInfo.id,
          description: description,
          weight: extractedWeight, // 추출된 중량 정보 저장
          imageUrl: imageUrl,
          categoryId: categoryId, // 자동 분류된 카테고리 ID 설정
          calories: caloriesTotal || 0,
          protein: proteinTotal || 0,
          carbs: carbsTotal || 0,
          fat: fatTotal || 0,
          saturatedFat: saturatedFatTotal,
          transFat: transFatTotal,
          cholesterol: cholesterolTotal,
          sodium: sodiumTotal,
          fiber: null,
          sugar: sugarTotal,
          calcium: null,
          iron: null,
          vitaminD: null,
          allergens: uniqueAllergens.length > 0 ? uniqueAllergens : null,
          featuredProduct: false // 기본값으로 설정
        };
        
        // 특정 제품은 인기 제품으로 표시
        if (
          productName.includes('빅맥') || 
          productName.includes('와퍼') || 
          productName.includes('불고기') ||
          productName.includes('오리지널')
        ) {
          product.featuredProduct = true;
        }
        
        // 캐시에 저장
        cachedProducts.set(product.id, product);
        console.log(`제품 추가됨: ${product.name} (${franchiseName})`);
      }
    }
    
    // 특수 제품 추가: 맘스터치 간장마늘싸이 버거 직접 추가
    const mamstouchFranchise = franchises.find(f => f.name === '맘스터치');
    if (mamstouchFranchise) {
      const soyGarlicSighBurger: Product = {
        id: productId++,
        name: "간장마늘싸이 버거",
        franchiseId: mamstouchFranchise.id,
        categoryId: 1, // 버거 카테고리
        description: "맘스터치의 간장마늘싸이 버거 메뉴입니다. (영양성분: 전체 250g 기준)",
        weight: 250, // 250g으로 설정
        imageUrl: "",
        calories: 289,
        protein: 14.07,
        carbs: 19.01,
        fat: 17.38,
        saturatedFat: 4.94,
        transFat: 0.19,
        cholesterol: 37.26,
        sodium: 511,
        fiber: null,
        sugar: 3.8,
        calcium: null,
        iron: null,
        vitaminD: null,
        allergens: [1, 2, 8], // 밀, 유제품, 대두
        featuredProduct: true
      };
      
      // 캐시에 저장
      cachedProducts.set(soyGarlicSighBurger.id, soyGarlicSighBurger);
      console.log(`특수 제품 추가됨: ${soyGarlicSighBurger.name} (맘스터치)`);
    }
    
    console.log(`총 ${cachedProducts.size}개 제품 로드 완료`);
    initialized = true;
    return Array.from(cachedProducts.values());
  } catch (error) {
    console.error('제품 데이터 로드 중 오류 발생:', error);
    return [];
  }
}

// 제품 검색
export async function searchProducts(query?: string, categoryId?: number, franchiseId?: number, nutritionalFilter?: any): Promise<Product[]> {
  // 데이터가 로드되지 않았으면 먼저 로드
  if (!initialized) {
    await loadProductData();
  }
  
  let results = Array.from(cachedProducts.values());
  
  // 검색어로 필터링
  if (query) {
    const queryLower = query.toLowerCase();
    
    // 먼저 제품 카테고리 이름이나 프랜차이즈 이름 기반으로 검색 (정확성 향상)
    const categoryMatches = categories.find(cat => 
      cat.name.toLowerCase().includes(queryLower) || 
      cat.nameKorean.toLowerCase().includes(queryLower)
    );
    
    // 카테고리에 해당하는 프랜차이즈 목록
    let categoryFranchiseIds: number[] = [];
    if (categoryMatches) {
      categoryFranchiseIds = franchises
        .filter(f => f.categoryId === categoryMatches.id)
        .map(f => f.id);
      
      // 이 카테고리에 속한 프랜차이즈의 제품만 필터링
      if (categoryFranchiseIds.length > 0) {
        results = results.filter(p => categoryFranchiseIds.includes(p.franchiseId));
        
        // 카테고리 이름과 제품 이름에 모두 검색어가 포함된 제품이 있으면 우선 반환
        const categoryAndNameMatches = results.filter(p => 
          p.name.toLowerCase().includes(queryLower)
        );
        
        if (categoryAndNameMatches.length > 0) {
          return categoryAndNameMatches;
        }
        
        // 카테고리 검색 결과가 있으면 반환 (좀 더 정확한 카테고리 검색 결과)
        return results;
      }
    }
    
    // 검색어를 토큰으로 분리 (예: "더블쿼터파운더" -> ["더블", "쿼터", "파운더"])
    const searchTokens = queryLower.split(/[\s-_]/).filter(t => t.length > 1);
    
    // 1. 정확히 일치하는 제품 찾기
    const exactMatches = results.filter(product => 
      product.name.toLowerCase() === queryLower ||
      (product.description && product.description.toLowerCase() === queryLower)
    );
    
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // 2. 전체 검색어가 제품 이름에 포함된 경우 (부분 문자열 검색)
    const fullQueryMatches = results.filter(product => 
      product.name.toLowerCase().includes(queryLower)
    );
    
    if (fullQueryMatches.length > 0) {
      return fullQueryMatches;
    }
    
    // 3. 모든 토큰이 제품 이름에 포함된 제품 찾기 (AND 검색, 좀 더 엄격한 기준)
    const tokenMatches = results.filter(product => {
      const productNameLower = product.name.toLowerCase();
      
      return searchTokens.every(token => 
        productNameLower.includes(token)
      );
    });
    
    if (tokenMatches.length > 0) {
      return tokenMatches;
    }
    
    // 4. 이름과 설명에서 검색 (좀 더 넓은 범위로 검색)
    results = results.filter(product => 
      product.name.toLowerCase().includes(queryLower) ||
      (product.description && product.description.toLowerCase().includes(queryLower))
    );
  }
  
  // 카테고리 ID로 필터링
  if (categoryId) {
    // 해당 카테고리의 프랜차이즈 ID 목록 찾기
    const categoryFranchiseIds = franchises
      .filter(franchise => franchise.categoryId === categoryId)
      .map(franchise => franchise.id);
    
    results = results.filter(product => 
      categoryFranchiseIds.includes(product.franchiseId)
    );
  }
  
  // 프랜차이즈 ID로 필터링
  if (franchiseId) {
    results = results.filter(product => product.franchiseId === franchiseId);
  }
  
  // 영양소 필터링
  if (nutritionalFilter) {
    // 칼로리 필터
    if (nutritionalFilter.minCalories !== undefined) {
      results = results.filter(product => product.calories >= nutritionalFilter.minCalories);
    }
    if (nutritionalFilter.maxCalories !== undefined) {
      results = results.filter(product => product.calories <= nutritionalFilter.maxCalories);
    }
    
    // 단백질 필터
    if (nutritionalFilter.minProtein !== undefined) {
      results = results.filter(product => product.protein >= nutritionalFilter.minProtein);
    }
    if (nutritionalFilter.maxProtein !== undefined) {
      results = results.filter(product => product.protein <= nutritionalFilter.maxProtein);
    }
    
    // 탄수화물 필터
    if (nutritionalFilter.minCarbs !== undefined) {
      results = results.filter(product => product.carbs >= nutritionalFilter.minCarbs);
    }
    if (nutritionalFilter.maxCarbs !== undefined) {
      results = results.filter(product => product.carbs <= nutritionalFilter.maxCarbs);
    }
    
    // 지방 필터
    if (nutritionalFilter.minFat !== undefined) {
      results = results.filter(product => product.fat >= nutritionalFilter.minFat);
    }
    if (nutritionalFilter.maxFat !== undefined) {
      results = results.filter(product => product.fat <= nutritionalFilter.maxFat);
    }
  }
  
  return results;
}

// 데이터 초기화 함수 (서버 시작 시 호출)
export function initializeData() {
  loadProductData()
    .then(() => console.log('데이터 초기화 완료'))
    .catch(error => console.error('데이터 초기화 실패:', error));
}

// 카테고리, 프랜차이즈, 알러젠 데이터 가져오기
export function getCategories(): Category[] {
  return categories;
}

export function getFranchises(): Franchise[] {
  return franchises;
}

export function getAllergens(): Allergen[] {
  return allergens;
}

// 특정 ID로 데이터 찾기
export function getCategoryById(id: number): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getFranchiseById(id: number): Franchise | undefined {
  return franchises.find(franchise => franchise.id === id);
}

export function getAllergenById(id: number): Allergen | undefined {
  return allergens.find(allergen => allergen.id === id);
}

export function getProductById(id: number): Product | undefined {
  return cachedProducts.get(id);
}

// 특정 프랜차이즈의 제품 가져오기
export function getProductsByFranchise(franchiseId: number): Product[] {
  return Array.from(cachedProducts.values())
    .filter(product => product.franchiseId === franchiseId);
}