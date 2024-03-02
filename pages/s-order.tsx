import { Button } from "@/components/ui/OR_button"
import { CardContent, Card } from "@/components/ui/OR_card"

import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';
import { getSessionData } from '@/utils/auth';

export default function Seller_order() {
  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { key } = getSessionData();

  useEffect(() => {
    // POST 요청 body에 담을 데이터
    const requestData = {
    key: key,
    page: page,  // page를 body에 포함
    };

    // POST 요청 설정
    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
    };

    // 서버에 POST 요청 보내기
    fetch(`${API_BASE_URL}/api/seller-order`, requestOptions)
    .then(response => response.json())
    .then((data: PagedOrderList) => {
        console.log('data', data);
        setOrders(data.data);
        setTotalPages(data.totalPage);
    })
    .catch(error => console.error('Error fetching data:', error));
}, [key, page]);

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
      <div className="max-w-screen-xl mx-auto bg-white">
        <main className="py-6 px-6">
          <section className="mb-6">
            <div className="grid grid-cols-1 gap-4">
              {orders.length > 0 ? (
                orders.map(order => (
                <Card className="w-full flex" key={order.productId}>
                  <CardContent className="flex-1 flex items-center">
                    <div className="flex-shrink-0 mr-4 mt-4">
                      <img
                        alt={order.productName}
                        height="150"
                        src={`${API_BASE_URL}${order.productImageUrl}`}
                        style={{
                          objectFit: "cover",
                        }}
                        width="150"
                      />
                    </div>
                    <div>
                      <div className="text-sm">
                        <p>주문일자 {formatDate(order.orderDate)}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold">{order.productName}</h4>
                        <p className="text-sm">{`주문수량 ${order.orderQuantity}개 / 주문 가격 ${numberWithCommas(order.orderPrice)}원`}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p>{order.buyerName} ({order.buyerPhoneNumber})</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p>{order.buyerAddr}</p>
                        </div>
                      </div>
                    </div>

                    {/* 우측 그리드 - 배송완료 버튼 */}
                    <div className="flex-shrink-0 ml-auto">
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" className="bg-green-500 text-white">배송완료</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
                ) : (
                    <p className="text-gray-500">등록된 상품이 없습니다</p>
                )}
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


interface Order {
  buyerId: string;
  buyerName: string;
  buyerPhoneNumber: string;
  buyerAddr: string;

  productId: string;
  productName:string;
  productImageUrl:string;

  sellerId: string;
  orderQuantity:Number;
  orderPrice:Number;
  orderDate:Date;
}

interface PagedOrderList {
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
  data: Order[];
}