import Header from './header';
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
import router from 'next/router';
/*차콜색 212121*/

export default function Main({ userId }: { userId: string }) {

  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchResults, setSearchResults] = useState<Product[]>([]); // 추가: 검색 결과 상태 추가
  const [searchQuery, setSearchQuery] = useState<string>(''); // 추가: 검색어 상태 추가

  const handleSearch = async (keyword: string) => {
    // 라우터 라이브러리를 사용하여 URL 업데이트
    await router.push(`/search?keyword=${keyword}&page=1`);
  
    // 검색 결과를 가져오기 위해 새로운 페이지를 1로 초기화하고, 검색 요청을 수행합니다.
    setPage(1);
  
    // 실제 검색 요청 로직을 수행하고, 검색 결과를 setProducts로 업데이트합니다.
    // 이 로직은 검색 엔진이나 서버에 맞게 구현되어야 합니다.
    fetch(`http://192.168.0.132:9988/api/search?keyword=${keyword}&page=1`)
      .then(response => response.json())
      .then((data: PagedProductList) => {
        setProducts(data.data);
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error searching:', error));
  };

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
      <Header userId={userId} onSearch={handleSearch}/>
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