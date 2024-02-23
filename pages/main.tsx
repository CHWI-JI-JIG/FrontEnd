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
/*차콜색 212121*/

export default function Main({ userId }: { userId: string }) {

  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  //상품 데이터 가져오기 
  useEffect(() => {
    fetch(`https://796d83ff-369b-4a37-a58b-7b99853ce898.mock.pstmn.io/api/products?page=1`)
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
      <Header userId={userId}/>
      <main className="py-6 px-6">
        <section className="mb-6">
          <div className="grid grid-cols-4 grid-rows-5 gap-4">
            {products.map(product => (
              <Card className="w-full" key={product.productId}>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <img
                      alt={product.productName}
                      className="mb-2"
                      height="200"
                      src={product.productImageUrl}
                      style={{
                        aspectRatio: "200/200",
                        objectFit: "cover",
                      }}
                      width="200"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{product.productName}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{numberWithCommas(product.productPrice)}원</span>
                  </div>
                </CardContent>
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

interface User {
  userId: string;
  userName: string;
  email: string;
  login: boolean;
  auth: string;
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
  )
}