import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import { getSessionData, handleLogout } from '@/utils/auth'
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/config/apiConfig';
import { handleNextPage, handlePrevPage, numberWithCommas } from '@/utils/commonUtils';

import axios from 'axios';

export default function Search() {
  //search 페이지 접근통제(취약점 생성!!!)
  useEffect(() => {
    if (auth === 'ADMIN') {
        // 세션이 인증되지 않았거나 판매자가 아닌 경우 알림 표시 후 서버에서 메인 페이지로 리디렉션
        alert('접근 권한이 없습니다.');
        router.push('/admin').then(() => {
            // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
            window.location.href = '/admin';
        });
    }
  }, []);

  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const router = useRouter();
  const { page: queryPage, keyword } = router.query;
  const [page, setPage] = useState<number>(parseInt(queryPage as string, 10) || 1); // 초기 페이지 설정


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

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?page=${page}&keyword=${keyword}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { data: [], totalPage: 1 };
    }
  };

  // 검색 결과를 가져와서 state에 저장
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSearchResults();
      setSearchResults(data.data);
      setTotalPages(data.totalPage);
    };

    fetchData();
  }, [page, keyword]);

  const handleNext = () => handleNextPage(page, totalPages, setPage);
  const handlePrev = () => handlePrevPage(page, setPage);

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <img src="/cjj.png" alt="취지직 로고"
          className="w-auto h-12" onClick={() => { window.location.href = '/'; }} />
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
          {searchResults.length > 0 ? (
            <p className="text-lg font-bold">{`"${keyword}"에 대한 검색 결과 입니다.`}</p>
          ) : (
            <p className="text-lg font-bold">"{keyword}"에 대한 상품이 없습니다.</p>
          )}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-4 grid-rows-5 gap-4">
              {(searchResults).map((result) => (
                <Card className="w-full" key={result.productId}>
                  <a href={`/detail?productId=${result.productId}`}>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <img
                          alt={result.productName}
                          className="mb-2"
                          src={`${API_BASE_URL}${result.productImageUrl}`}
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
                        {result.productName}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{numberWithCommas(result.productPrice)}원</span>
                      </div>
                    </CardContent>
                  </a>
                </Card>
              ))}
            </div>
          )}

          {searchResults.length > 0 && (
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