import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import { getSessionData } from '@/utils/auth'
import { useRouter } from 'next/router';

export default function Search() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const router = useRouter();
  const { page: queryPage, keyword } = router.query;

  const [page, setPage] = useState<number>(parseInt(queryPage as string, 10) || 1); // 초기 페이지 설정

  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
  };
  
  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`http://192.168.0.132:5000/api/search?page=${page}&keyword=${keyword}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching search results:', error);
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


  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
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
        <Link href="/">
          <a className="text-3xl font-bold">취지직</a>
        </Link>
        <div className="flex space-x-4">
          {certification ? (
            <>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/mypage">{name}님</Link>
              </Button>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/login">로그인</Link>
              </Button>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/privacy-policy">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      
    <main className="py-6 px-6">
        <section className="mb-6">
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
                            src={result.productImageUrl}
                            style={{
                            height: "200",
                            width: "200",
                            objectFit: "cover",
                            }}
                        />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{result.productName}</h3>
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
                <Button onClick={handlePrevPage}><FaAngleLeft /></Button>
                <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
                <Button onClick={handleNextPage}><FaAngleRight /></Button>
                </div>
            </div>
            )}

            {searchResults.length === 0 && (
            <p className="text-lg font-bold">"{keyword}"에 대한 상품이 없습니다.</p>
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