import Link from "next/link"
import { Input } from "@/components/ui/MP_input"
import { SVGProps } from "react"

export function mypage() {
  return (
    <div className="bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <button className="text-gray-500 focus:outline-none lg:hidden">
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex space-x-8">
              <Link className="text-gray-900 hover:text-gray-900" href="#">
                카테고리
              </Link>
              <Link className="text-gray-500 hover:text-gray-900" href="#">
                브랜드
              </Link>
              <Link className="text-gray-500 hover:text-gray-900" href="#">
                카테고리
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 font-bold text-xl">INSBIZMALL</span>
          </div>
          <div className="flex items-center">
            <Input placeholder="검색어를 입력해 주세요." type="search" />
            <SearchIcon className="h-6 w-6 text-gray-500 ml-2" />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="bg-gray-200 p-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">회원님</h3>
                <div className="mt-1 grid gap-4">
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    전체보기
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    주문내역
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    쿠폰
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    포인트
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    게시판
                  </Link>
                  <Link className="text-gray-700 hover:text-gray-900" href="#">
                    최근 본 상품
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
                    <h4 className="mt-2 text-base font-medium text-gray-900">포인트 안내</h4>
                    <p className="mt-1 text-sm text-gray-500">0</p>
                  </div>
                  <div className="bg-white p-4">
                    <BoxIcon className="h-6 w-6 text-gray-500" />
                    <h4 className="mt-2 text-base font-medium text-gray-900">주문 안내</h4>
                    <p className="mt-1 text-sm text-gray-500">0 건</p>
                  </div>
                  <div className="bg-white p-4">
                    <MessageCircleIcon className="h-6 w-6 text-gray-500" />
                    <h4 className="mt-2 text-base font-medium text-gray-900">쿠폰 안내</h4>
                    <p className="mt-1 text-sm text-gray-500">0 건</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 p-4 mt-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">결제 상품</h3>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4">
                    <img
                      alt="Product Image"
                      className="rounded-md object-cover"
                      height={64}
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "64/64",
                        objectFit: "cover",
                      }}
                      width={64}
                    />
                    <h4 className="mt-2 text-base font-medium text-gray-900">Product Name</h4>
                    <p className="mt-1 text-sm text-gray-500">Quantity: 1</p>
                    <p className="mt-1 text-sm text-gray-500">Price: $10.00</p>
                    <p className="mt-1 text-sm text-gray-500">Delivery Status: In Transit</p>
                  </div>
                  <div className="bg-white p-4">
                    <img
                      alt="Product Image"
                      className="rounded-md object-cover"
                      height={64}
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "64/64",
                        objectFit: "cover",
                      }}
                      width={64}
                    />
                    <h4 className="mt-2 text-base font-medium text-gray-900">Product Name</h4>
                    <p className="mt-1 text-sm text-gray-500">Quantity: 2</p>
                    <p className="mt-1 text-sm text-gray-500">Price: $20.00</p>
                    <p className="mt-1 text-sm text-gray-500">Delivery Status: Delivered</p>
                  </div>
                  <div className="bg-white p-4">
                    <img
                      alt="Product Image"
                      className="rounded-md object-cover"
                      height={64}
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "64/64",
                        objectFit: "cover",
                      }}
                      width={64}
                    />
                    <h4 className="mt-2 text-base font-medium text-gray-900">Product Name</h4>
                    <p className="mt-1 text-sm text-gray-500">Quantity: 1</p>
                    <p className="mt-1 text-sm text-gray-500">Price: $15.00</p>
                    <p className="mt-1 text-sm text-gray-500">Delivery Status: Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


function MenuIcon(props: SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
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
  )
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
