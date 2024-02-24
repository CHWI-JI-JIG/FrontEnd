import React, { useState } from 'react';
import Header from './header';
import Smain from './s-main'; //상품목록
import Sorder from './s-order'; //주문조회
import Sreturn from './s-return'; //환불/반품조회
import Sreview from './s-review'; //리뷰
import Sqa from './s-qa'; //문의
import Link from "next/link"
import { useRouter } from 'next/router';  // useRouter 추가


export default function Seller({ userId }: { userId: string }) {
    const [selectedSection, setSelectedSection] = useState<string>('s_main');
    const router = useRouter();

    const renderSection = () => {
        switch (selectedSection) {
            case 's-main':
                return <Smain userId={userId} />;
            case 's-order':
                return <Sorder userId={userId} />;
            case 's-return':
                return <Sreturn userId={userId} />;
            case 's-review':
                return <Sreview userId={userId} />;
            case 's-qa':
                return <Sqa userId={userId} />;
        
            default:
                return null;
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto bg-white">
            <Header userId={userId}/>
            <nav className="flex justify-between items-center py-2 px-6 bg-[#f7f7f7]">
                <ul className="flex space-x-4">
                    <li>
                        <a
                        className="text-gray-700 hover:text-gray-900"
                        onClick={() => {
                            setSelectedSection('s-main');
                            router.push('/s-main');  // 페이지 변경
                        }}> 상품목록</a>
                        {/* <Link className="text-gray-700 hover:text-gray-900" href="/s_main">
                            상품목록
                        </Link> */}
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s-order">
                            주문조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s-return">
                            환불/반품조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s-review">
                            리뷰조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s-qa">
                            문의조회
                        </Link>
                    </li>
                </ul>
            </nav>

            {renderSection()}
        </div>
    );
}