import React, { SVGProps, useEffect, useState } from 'react';
import Smain from './s-main'; //상품목록
import Sorder from './s-order'; //주문조회
import { useRouter } from 'next/router';  // useRouter 추가
import Link from "next/link"
import { Button } from "@/components/ui/MA_button";
import { Input } from "@/components/ui/MA_input";
import axios from 'axios';

const getSessionData = () => {
    // sessionStorage가 있는지 확인
    if (typeof sessionStorage !== 'undefined') {
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

export default function Seller() {
    // 세션 데이터 가져오기
    const { auth, certification, name, key } = getSessionData();
    
    const handleLogout = () => {
        // sessionStorage 초기화
        if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
        }
    };

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
                return <Smain />;
            case 's-order':
                return <Sorder />;
            default:
                return null;
        }
    };

    return (
        <>
            <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
                <a className="text-3xl font-bold" onClick={() => {window.location.reload();}}>취지직</a>
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