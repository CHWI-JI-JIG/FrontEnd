import React, { useEffect, useState } from 'react';
import Header from './header';
import Smain from './s-main'; //상품목록
import Sorder from './s-order'; //주문조회
import { useRouter } from 'next/router';  // useRouter 추가


export default function Seller({ userId }: { userId: string }) {
    const [selectedSection, setSelectedSection] = useState<string>('s-main');
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
        setSelectedSection(hash || 's-main');
    }, [router.asPath]); // 페이지 이동 시에도 반응

    const renderSection = () => {
        switch (selectedSection) {
            case 's-main':
                return <Smain userId={userId} />;
            case 's-order':
                return <Sorder userId={userId} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Header userId={userId} onSearch={() => {}}/>
            <nav className="flex justify-between items-center py-2 px-6 bg-[#f7f7f7]">
                <ul className="flex space-x-4">
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's-main' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s-main')}>
                            상품목록
                        </a>
                    </li>
                    <li>
                        <a
                            className={`text-gray-700 hover:text-gray-900 ${selectedSection === 's-order' && 'font-bold'}`}
                            onClick={() => handleSectionChange('s-order')}>
                            주문조회
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