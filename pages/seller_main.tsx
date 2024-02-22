import { Button } from "@/components/ui/MA_button"
import Link from "next/link"
import { Input } from "@/components/ui/MA_input"
import { CardContent, Card } from "@/components/ui/MA_card"
import { SVGProps } from "react"
import "@/app/globals.css"

export default function Seller_main() {

    /*가격 자릿수*/
    const numberWithCommas = (number: { toLocaleString: () => any }) => {
        return number.toLocaleString();
    };

    return (
        <div className="max-w-screen-xl mx-auto bg-white">
            <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
                <h1 className="text-3xl font-bold">취지직</h1>
                <div className="flex items-center space-x-2">
                <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요" />
                <Button className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
                    <SearchIcon className="text-gray-700" />
                </Button>
                </div>

                <div className="flex space-x-4">
                    <Button className="text-black bg-[#F1F5F9]" variant="ghost">
                        로그인
                    </Button>
                    <Button className="text-black bg-[#F1F5F9]" variant="ghost">
                        회원가입
                    </Button>
                </div>
            </header>

            <nav className="flex justify-between items-center py-2 px-6 bg-[#f7f7f7]">
                <ul className="flex space-x-4">
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="#">
                            상품목록
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="#">
                            주문조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="#">
                            환불/반품조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="#">
                            리뷰조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="#">
                            문의조회
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex space-x-4">
                    {/* 판매 중, 판매 완료 상태 선택 */}
                    <select className="border rounded-md py-1 px-2">
                        <option value="selling">판매중</option>
                        <option value="sold">판매완료</option>
                    </select>
                    <Input className="w-96 border rounded-md  text-black" placeholder="상품 검색" />
                    <Button className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
                        <SearchIcon className="text-gray-700" />
                    </Button>
                </div>

                <Button className="text-white bg-[#212121]">상품 등록</Button>
            </div>

            <main className="py-6 px-6">
                <section className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                    <Card className="w-full">
                        <CardContent className="grid grid-cols-10 items-center">
                    
                            <div className="col-span-1 mr-4">
                                <img
                                    alt="Product"
                                    height="100"
                                    src="/placeholder.svg"
                                    style={{
                                        aspectRatio: "200/200",
                                        objectFit: "cover",
                                    }}
                                    width="100"
                                />
                            </div>
                            
                            <div className="col-span-8">
                                <h3 className="text-lg font-semibold mb-1">[상품명] 최고급 한우 볶음밥</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">{numberWithCommas(123543)}원</span>
                                </div>
                            </div>
                  
                            <div className="col-span-1">
                                <div className="flex items-center justify-end">
                                    <Button className="text-white bg-[#212121] mr-2">수정</Button>
                                    {/*<Button className="bg-red-500 hover:bg-red-700 text-white">버튼2</Button>*/}
                                    <select className="border rounded-md py-1 px-2">
                                        <option value="selling">판매중</option>
                                        <option value="sold">판매완료</option>
                                    </select>
                                </div>
                            </div>
                            
                        </CardContent>
                    </Card>
                    </div>
                </section>
            </main>
        </div>
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