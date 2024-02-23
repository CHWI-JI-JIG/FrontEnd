import React, { useState } from 'react';
import Header from './header';
import Smain from './s_main'; //상품목록
import Sorder from './s_order'; //주문조회
import Sreturn from './s_return'; //환불/반품조회
import Sreview from './s_review'; //리뷰
import Sqa from './s_qa'; //문의
import Link from "next/link"
import { useRouter } from 'next/router';  // useRouter 추가


export default function Seller({ userId }: { userId: string }) {
    const [selectedSection, setSelectedSection] = useState<string>('s_main');
    const router = useRouter();

    const renderSection = () => {
        switch (selectedSection) {
            case 's_main':
                return <Smain userId={userId} />;
            case 's_order':
                return <Sorder userId={userId} />;
            case 's_return':
                return <Sreturn userId={userId} />;
            case 's_review':
                return <Sreview userId={userId} />;
            case 's_qa':
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
                            setSelectedSection('s_main');
                            router.push('/s_main');  // 페이지 변경
                        }}> 상품목록</a>
                        {/* <Link className="text-gray-700 hover:text-gray-900" href="/s_main">
                            상품목록
                        </Link> */}
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s_order">
                            주문조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s_return">
                            환불/반품조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s_review">
                            리뷰조회
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-700 hover:text-gray-900" href="/s_qa">
                            문의조회
                        </Link>
                    </li>
                </ul>
            </nav>

            {renderSection()}
        </div>
    );
}