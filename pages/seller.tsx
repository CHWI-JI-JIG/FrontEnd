import React, { SVGProps, useEffect, useState } from 'react';
import Smain from './s-main'; //상품목록
import Sorder from './s-order'; //주문조회
import { useRouter } from 'next/router';  // useRouter 추가
import Link from "next/link"
import { Button } from "@/components/ui/MA_button";
import { Input } from "@/components/ui/MA_input";
import axios from 'axios';


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

    /*헤더...*/
    const [user, setUser] = useState<User | null>(null);

    // 세션 데이터 가져오기
    useEffect(() => {
        if (userId) {
        axios.post(`http://192.168.0.132:9988/api/get-session`, { userId })
            .then(response => {
            setUser(response.data.data); // 세션 정보를 상태에 저장
            })
            .catch(error => console.error('Error fetching session:', error));
        }
    }, [userId]);

    const handleLogout = () => {
        fetch('http://192.168.0.132:9988/api/logout', {
        method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            setUser(null); // 로그아웃 시 세션 정보를 초기화
        })
        .catch(error => console.error('Error logging out:', error));
    };

    return (
        <>
            <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
                <Link href="/">
                <a className="text-3xl font-bold">취지직</a>
                </Link>
                <div className="flex items-center space-x-2">
                <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"/>
                <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
                    <SearchIcon className="text-gray-700" />
                </Button>
                </div>
                <div className="flex space-x-4">
                {user ? (
                    <>
                    <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                        <Link href="/mypage">{user.userName}님</Link>
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

    interface User {
        userId: string;
        userName: string;
        email: string;
        login: boolean;
        auth: string;
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
}