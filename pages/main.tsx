import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import { getSessionData } from '@/utils/auth'
import { API_BASE_URL } from '@/config/apiConfig';
import { useRouter } from 'next/router';

export default function Main() {
  const router = useRouter();

  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      router.push('/');
    }
  };

  // 상품정보 받는 중
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?page=${page}`)
      .then(response => response.json())
      .then((data: PagedProductList) => {
        console.log('Search Results:', data.data);
        if (data.data.length > 0) {
          console.log('First product image URL:', data.data[0].productImageUrl);
        }
        setProducts(data.data);
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
    }, [page]);

    //검색창
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
  
    const handleSearch = async () => {
      try {
        console.log('Keyword:', keyword);
        const response = await fetch(`${API_BASE_URL}/api/search?page=1&keyword=${keyword}`);
        const data = await response.json();
        setSearchResults(data.data);
        setTotalPages(data.totalPage);
        console.log('Search Results:', data.data);
  
        // 검색된 결과 페이지 이동
        router.push({
          pathname: '/search',
          query: { page: 1, keyword },
        });

      } catch (error) {
        console.error('Error searching:', error);
      }
    };   
    
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /*가격 자릿수*/
  const numberWithCommas = (number: { toLocaleString?: () => any }) => {
    if (number && number.toLocaleString) {
      return number.toLocaleString();
    }
    return '';
  };

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <img src="/cjj.png" alt="취지직 로고" 
        className="w-auto h-12" onClick={() => {window.location.reload();}} />
        <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"
          value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost" onClick={handleSearch}>
            <SearchIcon className="text-gray-700" />
          </Button>
        </div>
        <div className="flex space-x-4">
          {certification ? (
            <>
              <Link href={auth === 'BUYER' ? '/mypage' : auth === 'SELLER' ? '/seller' : '/admin'}>
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">{name}님</Button>
              </Link>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">로그인</Button>
              </Link>
              <Link href="/privacy-policy">
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      
      <main className="py-6 px-6">
        <section className="mb-6">
          {products.length > 0 ? (
          <div className="grid grid-cols-4 grid-rows-5 gap-4">
            {(products).map((product) => (
              <Card className="w-full" key={product.productId}>
                <a href={`/detail?productId=${product.productId}`}>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <img
                        alt={product.productName}
                        className="mb-2"
                        src={`${API_BASE_URL}${product.productImageUrl}`}
                        style={{
                          height: "200",
                          width: "200",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{product.productName}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{numberWithCommas(product.productPrice)}원</span>
                    </div>
                  </CardContent>
                </a>
              </Card>
            ))}
            </div>
          ) : (
            <p className="text-lg font-bold">상품이 없습니다.</p>
          )}

          <div className="flex flex-col items-center mt-4">
            <div className="flex">
              <Button onClick={handlePrevPage}><FaAngleLeft /></Button>
              <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
              <Button onClick={handleNextPage}><FaAngleRight /></Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

interface Product {
  productId: string;
  productName: string;
  productImageUrl: string;
  productPrice: number;
}

interface PagedProductList {
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
  data: Product[];
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}