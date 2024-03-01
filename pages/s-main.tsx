import { Button } from "@/components/ui/MA_button"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css"
import React, { useEffect, useState } from 'react';
import ProductRegistration from './product-registration';
import { getSessionData } from '@/utils/auth';

export default function Seller_main() {
  /*상품정보 받는 중*/
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showProductModal, setShowProductModal] = useState(false);
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
        fetch('http://192.168.0.132:5000/api/sproducts', requestOptions)
        .then(response => response.json())
        .then((data: PagedProductList) => {
            console.log('data', data);
            setProducts(data.data);
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
            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex space-x-4">
                    <select className="border rounded-md py-1 px-2">
                        <option value="selling">판매중</option>
                        <option value="sold">판매완료</option>
                    </select>
                    <Input className="w-96 border rounded-md  text-black" placeholder="상품 검색" />
                    <Button className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
                        <SearchIcon className="text-gray-700" />
                    </Button>
                </div>

                <Button className="text-white bg-[#212121]" onClick={() => setShowProductModal(true)}>상품 등록</Button>
            </div>

            {/* 상품 등록 모달 */}
            {showProductModal && <ProductRegistration onClose={() => setShowProductModal(false)} />}

            <main className="py-6 px-6">
                <section className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <Card className="w-full" key={product.productId}>
                            <a href={`/detail?productId=${product.productId}`}>
                            <CardContent className="grid grid-cols-10 items-center">
                            <div className="col-span-1 mr-4">
                                <img
                                alt={product.productName}
                                height="150"
                                src={`http://192.168.0.132:5000${product.productImageUrl}`}
                                style={{
                                    objectFit: "cover",
                                }}
                                width="150"
                                />
                            </div>

                            <div className="col-span-8">
                                <h3 className="text-lg font-semibold mb-1">{product.productName}</h3>
                                <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">{numberWithCommas(product.productPrice)}원</span>
                                </div>
                                <div className="text-sm mt-2 text-gray-500">{formatDate(product.regDate)}</div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex items-center justify-end">
                                <Button className="text-white bg-[#212121] h-full mr-2">
                                    판매중
                                </Button>
                                </div>
                            </div>
                            </CardContent>
                            </a>
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

interface Product {
    productId: string;
    productName: string;
    productImageUrl: string;
    productPrice: number;
    regDate:Date;
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
    )
}