import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { JSX, SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import axios from "axios"
/*추가 중*/
import React, { useEffect, useState } from 'react';
/*차콜색 212121*/

export default function Main({ userId }: { userId: string }) {
  /*헤더...*/
  const [user, setUser] = useState<User | null>(null);

  // 세션 데이터 가져오기
  useEffect(() => {
    if (userId) {
      axios.post(`http://192.168.0.132:9988/api/get-session`, { userId })
        .then(response => {
          setUser(response.data.data); // 세션 정보를 상태에 저장
        })
        .catch(error => console.error('Error fetching session:', error));
    }
  }, [userId]);

  const handleLogout = () => {
    fetch('http://192.168.0.132:9988/api/logout', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setUser(null); // 로그아웃 시 세션 정보를 초기화
      })
      .catch(error => console.error('Error logging out:', error));
  };

  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  //상품 데이터 가져오기 
  useEffect(() => {
    fetch(`http://192.168.0.132:9988/api/products?page=1`)
      .then(response => response.json())
      .then((data: PagedProductList) => {
        setProducts(data.data);
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [page]);

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
  const numberWithCommas = (number: { toLocaleString: () => any }) => {
    return number.toLocaleString();
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
        <Link href="/">
          <a className="text-3xl font-bold">취지직</a>
        </Link>
        <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"/>
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
            <SearchIcon className="text-gray-700" />
          </Button>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/mypage">{user.userName}님</Link>
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
          <div className="grid grid-cols-4 grid-rows-5 gap-4">
            {products.map(product => (
              <Card className="w-full" key={product.productId}>
                <a href={`/detail?productId=${product.productId}`}>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <img
                      alt={product.productName}
                      className="mb-2"
                      src={product.productImageUrl}
                      style={{
                        height:"200",
                        width:"200",
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

interface User {
  userId: string;
  userName: string;
  email: string;
  login: boolean;
  auth: string;
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