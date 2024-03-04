// commonUtils.ts

import { NextRouter } from 'next/router';
import { API_BASE_URL } from '@/config/apiConfig';

export interface searchProduct {
  productId: string;
  productName: string;
  productImageUrl: string;
  productPrice: number;
}

export const handleSearch = async (
  keyword: string,
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>,
  setSearchResults: React.Dispatch<React.SetStateAction<searchProduct[]>>,
  router: NextRouter
) => {
  try {
    console.log('Keyword:', keyword);
    const response = await fetch(`${API_BASE_URL}/api/search?page=1&keyword=${keyword}`);
    const data = await response.json();
    setSearchResults(data.data);

    // 검색된 결과 페이지 이동
    router.push({
      pathname: '/search',
      query: { page: 1, keyword },
    });
  } catch (error) {
    console.error('Error searching:', error);
  }
};
