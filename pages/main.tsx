import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import { getSessionData, handleLogout } from '@/utils/auth'
import { API_BASE_URL } from '@/config/apiConfig';
import { useRouter } from 'next/router';
import { handleNextPage, handlePrevPage, numberWithCommas } from '@/utils/commonUtils';
import { handleSearch, searchProduct } from '@/utils/search';

import axios from "axios";

export default function Main() {
  const router = useRouter();

  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();

  const handleLogoutClick = async () => {
    handleLogout(router);
  
    try {
      // 세션 종료 요청
      await axios.post(`${API_BASE_URL}/api/logout`, {
        "key" : key
      });
  
      // 로그아웃 후 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // //main 페이지 접근통제(취약점 생성!!!)
  // useEffect(() => {
  //   if (auth === 'ADMIN') {
  //       // 세션이 인증되지 않았거나 판매자가 아닌 경우 알림 표시 후 서버에서 메인 페이지로 리디렉션
  //       alert('접근 권한이 없습니다.');
  //       router.push('/admin').then(() => {
  //           // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
  //           window.location.href = '/admin';
  //       });
  //   }
  // }, []);

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
  const [searchResults, setSearchResults] = useState<searchProduct[]>([]);
  const onSearch = async () => {
    await handleSearch(keyword, setKeyword, setSearchResults, router);
  };

  const handleNext = () => handleNextPage(page, totalPages, setPage);
  const handlePrev = () => handlePrevPage(page, setPage);

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <img src="/cjj.png" alt="취지직 로고"
          className="w-auto h-12" onClick={() => { window.location.reload(); }} />
        <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"
            value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost" onClick={onSearch}>
            <SearchIcon className="text-gray-700" />
          </Button>
        </div>
        <div className="flex space-x-4">
          {certification ? (
            <>
              <Link href={auth === 'BUYER' ? '/mypage' : auth === 'SELLER' ? '/seller' : '/admin'}>
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">{name}님</Button>
              </Link>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogoutClick}>
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
                      <h3 className="text-lg font-semibold mb-1 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2
                      }}>
                        {product.productName}
                      </h3>
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

          {totalPages > 0 && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex">
                <Button onClick={handlePrev}><FaAngleLeft /></Button>
                <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
                <Button onClick={handleNext}><FaAngleRight /></Button>
              </div>
            </div>
          )}
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