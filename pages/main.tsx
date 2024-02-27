import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { JSX, SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';

const getSessionData = () => {
  // sessionStorage가 있는지 확인
  if (typeof sessionStorage !== 'undefined') {
    // 세션 데이터를 어디서든 가져오는 논리를 구현합니다.
    // 예를 들어 다음과 같이 사용할 수 있습니다.
    const sessionData = {
      auth: sessionStorage.getItem('auth'),
      certification: sessionStorage.getItem('certification'),
      key: sessionStorage.getItem('key'),
      name: sessionStorage.getItem('name'),
    };

    return sessionData;
  } else {
    // sessionStorage가 없으면 적절한 대체값을 반환하거나 오류 처리를 수행합니다.
    return { auth: null, certification: null, key: null, name: null };
  }
};

export default function Main() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
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

  //검색창
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = async () => {
    try {
      console.log('Keyword:', keyword);
      const response = await fetch(`http://192.168.0.132:9988/api/search?keyword=${keyword}`);
      const data = await response.json();
      setSearchResults(data.data);
      
      console.log('Search Results:', data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };


  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <a className="text-3xl font-bold" onClick={() => {window.location.reload();}}>취지직</a>
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
          <div className="grid grid-cols-4 grid-rows-5 gap-4">
            {(searchResults.length > 0 ? searchResults : products).map(product => (
              <Card className="w-full" key={product.productId}>
                <a href={`/detail?productId=${product.productId}`}>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <img
                        alt={product.productName}
                        className="mb-2"
                        src={product.productImageUrl}
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