import Link from "next/link"
import { Input } from "@/components/ui/MP_input"
import { SVGProps, useEffect, useState } from "react"
import { Button } from "@/components/ui/MA_button";
import "@/app/globals.css"
import axios from "axios";
import { getSessionData } from '@/utils/auth';
import { useRouter } from 'next/router';
const apiUrl = 'http://192.168.0.132:5000'; 
export default function Mypage() {
  const router = useRouter();
  // 세션 데이터 가져오기
  const { auth, certification, name, key } = getSessionData();
  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  };

  //검색창
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleSearch = async () => {
    try {
      console.log('Keyword:', keyword);
      const response = await fetch(`${apiUrl}/api/search?page=1&keyword=${keyword}`);
      const data = await response.json();
      setSearchResults(data.data);
      setTotalPages(data.totalPage);
      console.log('Search Results:', data.data);

      // 검색된 결과 페이지 이동
      router.push({
        pathname: '/search',
        query: { page: 1, keyword },
      });

    } catch (error) {
      console.error('Error searching:', error);
    }
  };  

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  //주문내역 
  useEffect(() => {
    if (key) {
      // 서버 API 호출
      axios.post(`${apiUrl}/api/order-history`, { key })
        .then(response => {
          setOrderHistory(response.data.data?.orderHistory || []); // 주문 내역 저장
        })
        .catch(error => console.error('주문 내역 가져오기 오류:', error));
    }
  }, [key]);

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
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <Link href="/">
          <a className="text-3xl font-bold">취지직</a>
        </Link>
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="bg-gray-200 p-4">
                <div className="mt-1 grid gap-4">
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    전체보기
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    주문내역
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    쿠폰내역
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    포인트 사용 내역
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-gray-200 p-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">마이페이지</h3>
                <div className="mt-1 grid grid-cols-3 gap-4">
                  <div className="bg-white p-4">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                    <h4 className="mt-2 text-base font-medium text-gray-900">포인트</h4>
                    <p className="mt-1 text-sm text-gray-500">고정값: 10000</p>
                  </div>
                  <div className="bg-white p-4">
                    <BoxIcon className="h-6 w-6 text-gray-500" />
                    <h4 className="mt-2 text-base font-medium text-gray-900">주문</h4>
                    <p className="mt-1 text-sm text-gray-500">{orderHistory.length}건</p>
                  </div>
                  <div className="bg-white p-4">
                    <MessageCircleIcon className="h-6 w-6 text-gray-500" />
                    <h4 className="mt-2 text-base font-medium text-gray-900">쿠폰</h4>
                    <p className="mt-1 text-sm text-gray-500">고정값: 3 개</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 p-4 mt-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">주문내역</h3>
                {orderHistory.length === 0 ? (
                  <p>주문 내역이 없습니다</p>
                ) : (
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="bg-white p-4">
                      <img
                        alt="Product Image"
                        className="rounded-md object-cover"
                        height={64}
                        src={order.productImageUrl}
                        style={{
                          aspectRatio: "64/64",
                          objectFit: "cover",
                        }}
                        width={64}
                      />
                      <h4 className="mt-2 text-base font-medium text-gray-900">{order.productName}</h4>
                      <p className="mt-1 text-sm text-gray-500">구매수량: {order.orderQuantity}</p>
                      <p className="mt-1 text-sm text-gray-500">구매총가격: {order.orderPrice}</p>
                      <p className="mt-1 text-sm text-gray-500">구매날짜: {formatDate(order.orderDate)}</p>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface Order {
  productId: string;
  productName: string;
  productImageUrl: string;
  orderQuantity: number;
  orderPrice: number;
  orderDate: Date;
}

interface Product {
  productId: string;
  productName: string;
  productImageUrl: string;
  productPrice: number;
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BoxIcon(props:SVGProps<SVGSVGElement>) {
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
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function MessageCircleIcon(props:SVGProps<SVGSVGElement>) {
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
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  )
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