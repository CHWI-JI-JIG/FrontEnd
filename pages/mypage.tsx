import Link from "next/link"
import { Input } from "@/components/ui/MP_input"
import { SVGProps, useEffect, useState } from "react"
import { Button } from "@/components/ui/MA_button";
import "@/app/globals.css"
import axios from "axios";
import { getSessionData, handleLogout } from '@/utils/auth';
import { API_BASE_URL } from '@/config/apiConfig';
import { useRouter } from 'next/router';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { handleNextPage, handlePrevPage, numberWithCommas, formatDate } from '@/utils/commonUtils';
import { handleSearch, searchProduct } from '@/utils/search';
export default function Mypage() {
  // 세션 데이터 가져오기
  const { auth, certification, name, key } = getSessionData();
  const router = useRouter();

  //검색창 테스트
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<searchProduct[]>([]);
  const onSearch = async () => {
    await handleSearch(keyword, setKeyword, setSearchResults, router);
  };

  //mypage 접근통제(취약점 생성!!!)
    useEffect(() => {
      if (auth !== 'BUYER') {
        let redirectTo = '/'; 
        if (auth === 'SELLER') {
          redirectTo = '/seller';
        } else if (auth === 'ADMIN') {
          redirectTo = '/admin';
        }

        alert('접근 권한이 없습니다.');
        router.push(redirectTo).then(() => {
          // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
          window.location.href = redirectTo;
        });
      }
    }, [auth,router]);
  //mypage 접근통제

  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);

  const handleLogoutClick = () => {
    handleLogout(router);
  };

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
    fetch(`${API_BASE_URL}/api/order-history`, requestOptions)
      .then(response => response.json())
      .then((data: PagedOrderList) => {
        setOrders(data.data);
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [key, page]);

  const handleNext = () => handleNextPage(page, totalPages, setPage);
  const handlePrev = () => handlePrevPage(page, setPage);

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <img src="/cjj.png" alt="취지직 로고"
          className="w-auto h-12" onClick={() => { window.location.href = '/'; }} />

        {/* 검색창 테스트 */}
        <div className="flex items-center space-x-2">
            <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"
              value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost" onClick={onSearch}>
              <SearchIcon className="text-gray-700" />
            </Button>
        </div>

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
                    <p className="mt-1 text-sm text-gray-500">{totalCount}건</p>
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
                {orders.length === 0 ? (
                  <p>주문 내역이 없습니다</p>
                ) : (
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order, index) => (
                      <div key={index} className="bg-white p-4">
                        <img
                          alt="Product Image"
                          className="rounded-md object-cover"
                          height={64}
                          src={`${API_BASE_URL}${order.productImageUrl}`}
                          style={{
                            aspectRatio: "64/64",
                            objectFit: "cover",
                          }}
                          width={64}
                        />

                        <h4 className="mt-2 text-base font-medium text-gray-900 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}>
                          {order.productName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">구매수량: {order.orderQuantity}</p>
                        <p className="mt-1 text-sm text-gray-500">구매총가격: {numberWithCommas(order.orderPrice)}원</p>
                        <p className="mt-1 text-sm text-gray-500">구매날짜: {formatDate(order.orderDate)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 0 && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="flex">
                      <Button onClick={handlePrev}><FaAngleLeft /></Button>
                      <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
                      <Button onClick={handleNext}><FaAngleRight /></Button>
                    </div>
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

interface PagedOrderList {
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
  data: Order[];
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

function BoxIcon(props: SVGProps<SVGSVGElement>) {
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

function MessageCircleIcon(props: SVGProps<SVGSVGElement>) {
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