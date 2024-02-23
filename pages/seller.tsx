import React, { useEffect, useState } from 'react';
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

    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    };
    
    // 선택한 섹션에 따라 해시를 변경
    useEffect(() => {
        window.location.hash = selectedSection;
    }, [selectedSection]);

    // 해시 변경에 따라 섹션 선택
    useEffect(() => {
        const hash = window.location.hash.substr(1);
        setSelectedSection(hash || 's_main');
    }, [router.asPath]); // 페이지 이동 시에도 반응

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
        <>
            <Header userId={userId}/>
            <nav className="flex justify-between items-center py-2 px-6 bg-[#f7f7f7]">
                <ul className="flex space-x-4">
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's_main' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s_main')}
                        >
                            상품목록
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's_order' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s_order')}
                        >
                            주문조회
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's_return' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s_return')}
                        >
                            환불/반품조회
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's_review' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s_review')}
                        >
                            리뷰조회
                        </a>
                    </li>

                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's_qa' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s_qa')}
                        >
                            문의조회
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="max-w-screen-xl mx-auto bg-white">
                {renderSection()}
            </div>
        </>
    );
}