import { Button } from "@/components/ui/OR_button"
import { CardContent, Card } from "@/components/ui/OR_card"

import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';

export default function Seller_order({ userId }: { userId: string }) {
  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  //상품 데이터 가져오기 
  useEffect(() => {
    fetch(`http://172.30.1.32:9988/api/seller-order?sellerId=abc&page=${page}`)
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

    /*날짜 형식*/
    function formatDate(dateString: string | number | Date) {
        const date = new Date(dateString);
    
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false};
    
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const [{ value: month },,{ value: day },,{ value: year },,
            { value: hour },,{ value: minute }
        ] = formatter.formatToParts(date);
    
        return `${year}/${month}/${day} ${hour}:${minute}`;
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="border-b pb-4 flex items-center">
                {/* 왼쪽에 정보를 배치하는 부분 */}
                <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">ORD20240209-0945056</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
                <div className="text-sm">
                    <p>배송일자: 2024.02.14</p>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold">관심리스트 펜슬 CC706/707/708 오크리지</h3>
                    <p className="text-sm">[관심리스트 상시할인]펜슬 CC706라이트베이지(+2,000원)</p>
                    <div className="flex justify-between items-center mt-2">
                    <p>20,000원 / 수량 1개</p>
                    <p className="text-sm mt-2">송장번호 455359784622</p>
                    </div>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button className="bg-black text-white">리뷰쓰기</Button>
                    <Button variant="outline">반품접수</Button>
                    <Button variant="outline">교환접수</Button>
                    <Button variant="outline">1:1문의</Button>
                </div>
                <div className="text-sm mt-4">
                    <p>배송비: 3,000원</p>
                </div>
                </div>
                
                {/* 오른쪽에 이미지를 배치하는 부분 */}
                <div className="flex-shrink-0 ml-4">
                <img
                    alt="Product"
                    className="h-24 w-24"
                    height="100"
                    src="/placeholder.svg"
                    style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                    }}
                    width="100"
                />
                </div>
            </div>
            </div>
    )
}

interface Product {
    buyerId: string;
    buyerName: string;
    buyerAddr: string;

    productId: string;
    productName:string;
    productImageUrl:string;

    sellerId: string;
    orderQuantity:Number;
    orderPrice:Number;
    orderDate:Date;
  }
  
interface PagedProductList {
    page: number;
    size: number;
    totalPage: number;
    totalCount: number;
    data: Product[];
  }
  
  function ChevronDownIcon(props:SVGProps<SVGSVGElement>) {
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  }
  