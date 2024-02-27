import Link from "next/link"
import { Input } from "@/components/ui/MP_input"
import { SVGProps, useEffect, useState } from "react"
import { Button } from "@/components/ui/MA_button";
import "@/app/globals.css"
import axios from "axios";

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

export default function Mypage() {
  // 세션 데이터 가져오기
  const { certification, name } = getSessionData();
  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  };

   const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // //주문내역 
  // useEffect(() => {
  //   if (userId) {
  //     // 서버 API 호출
  //     axios.post(`http://192.168.0.132:9988/api/order-history`, { userId })
  //       .then(response => {
  //         setUser(response.data.data); // 세션 정보 저장
  //         setOrderHistory(response.data.data?.orderHistory || []); // 주문 내역 저장
  //       })
  //       .catch(error => console.error('주문 내역 가져오기 오류:', error));
  //   }
  // }, [userId]);

  useEffect(() => {
    // 여기서 userId를 어떻게 가져올지에 대한 로직이 필요합니다.
    // userId가 없으면 주문 내역을 가져오지 않도록 처리하거나,
    // userId를 세션에서 가져오는 방식으로 수정해야 합니다.
    const userId = ""; // 여기에 userId 가져오는 로직을 추가해야 합니다.

    if (userId) {
      // 서버 API 호출
      axios.post(`http://192.168.0.132:9988/api/order-history`, { userId })
        .then(response => {
          // setUser(response.data.data); // setUser 함수가 어디서 정의되었는지 확인 필요
          setOrderHistory(response.data.data?.orderHistory || []); // 주문 내역 저장
        })
        .catch(error => console.error('주문 내역 가져오기 오류:', error));
    }
  }, []);

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
