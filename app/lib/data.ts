// Next.js 대신 Node.js에서 작동하는 방식으로 데이터 로드 및 처리
import { storage } from '../../server/storage';

// 카테고리 데이터 로드
export async function getCategories() {
  try {
    return await storage.getCategories();
  } catch (error) {
    console.error('카테고리 로드 오류:', error);
    throw new Error('카테고리 데이터를 로드하는 중 오류가 발생했습니다.');
  }
}

// 특정 카테고리 조회
export async function getCategory(id: number) {
  try {
    return await storage.getCategory(id);
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    throw new Error('카테고리 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 프랜차이즈 데이터 로드
export async function getFranchises() {
  try {
    return await storage.getFranchises();
  } catch (error) {
    console.error('프랜차이즈 로드 오류:', error);
    throw new Error('프랜차이즈 데이터를 로드하는 중 오류가 발생했습니다.');
  }
}

// 특정 프랜차이즈 조회
export async function getFranchise(id: number) {
  try {
    return await storage.getFranchise(id);
  } catch (error) {
    console.error('프랜차이즈 조회 오류:', error);
    throw new Error('프랜차이즈 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 카테고리별 프랜차이즈 조회
export async function getFranchisesByCategory(categoryId: number) {
  try {
    return await storage.getFranchisesByCategory(categoryId);
  } catch (error) {
    console.error('카테고리별 프랜차이즈 조회 오류:', error);
    throw new Error('카테고리별 프랜차이즈 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 알러젠 데이터 로드
export async function getAllergens() {
  try {
    return await storage.getAllergens();
  } catch (error) {
    console.error('알러젠 로드 오류:', error);
    throw new Error('알러젠 데이터를 로드하는 중 오류가 발생했습니다.');
  }
}

// 특정 알러젠 조회
export async function getAllergen(id: number) {
  try {
    return await storage.getAllergen(id);
  } catch (error) {
    console.error('알러젠 조회 오류:', error);
    throw new Error('알러젠 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 제품 데이터 로드
export async function getProducts() {
  try {
    return await storage.getProducts();
  } catch (error) {
    console.error('제품 로드 오류:', error);
    throw new Error('제품 데이터를 로드하는 중 오류가 발생했습니다.');
  }
}

// 특정 제품 조회
export async function getProduct(id: number) {
  try {
    const product = await storage.getProduct(id);
    if (!product) {
      return null;
    }

    // 알러젠 정보 추가
    if (product.allergens && Array.isArray(product.allergens)) {
      const allergenPromises = product.allergens.map(id => storage.getAllergen(id as number));
      const allergenObjects = await Promise.all(allergenPromises);
      
      // 알러젠 정보 포함하여 반환
      return {
        ...product,
        allergenDetails: allergenObjects.filter(a => a !== undefined)
      };
    }

    return product;
  } catch (error) {
    console.error('제품 조회 오류:', error);
    throw new Error('제품 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 프랜차이즈별 제품 조회
export async function getProductsByFranchise(franchiseId: number) {
  try {
    return await storage.getProductsByFranchise(franchiseId);
  } catch (error) {
    console.error('프랜차이즈별 제품 조회 오류:', error);
    throw new Error('프랜차이즈별 제품 정보를 조회하는 중 오류가 발생했습니다.');
  }
}

// 제품 검색
export async function searchProducts(params: any) {
  try {
    // 검색 파라미터 로깅
    console.log("searchProducts 호출:", params);

    // 영양소 값이 숫자로 변환
    const parsedParams: any = { ...params };
    
    // 칼로리 범위 처리
    if (params.calorieRange && !isNaN(Number(params.calorieRange)) && Number(params.calorieRange) > 0) {
      parsedParams.maxCalories = Number(params.calorieRange);
      console.log(`칼로리 필터 적용: ${params.calorieRange} kcal 이하`);
    }
    
    // 단백질 범위 처리
    if (params.proteinRange && !isNaN(Number(params.proteinRange)) && Number(params.proteinRange) > 0) {
      parsedParams.minProtein = Number(params.proteinRange);
    }
    
    // 탄수화물 범위 처리
    if (params.carbsRange && !isNaN(Number(params.carbsRange)) && Number(params.carbsRange) > 0) {
      parsedParams.maxCarbs = Number(params.carbsRange);
    }
    
    // 지방 범위 처리
    if (params.fatRange && !isNaN(Number(params.fatRange)) && Number(params.fatRange) > 0) {
      parsedParams.maxFat = Number(params.fatRange);
    }
    
    console.log("최종 검색 파라미터:", parsedParams);
    
    const products = await storage.searchProducts(parsedParams);
    console.log(`검색 결과: ${products.length}개 항목`);
    
    return products;
  } catch (error) {
    console.error('제품 검색 오류:', error);
    throw new Error('제품 검색 중 오류가 발생했습니다.');
  }
}