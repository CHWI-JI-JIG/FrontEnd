import React, { SVGProps, useEffect, useState } from 'react';
import Smain from './s-main'; //상품목록
import Sorder from './s-order'; //주문조회
import { useRouter } from 'next/router';  // useRouter 추가
import Link from "next/link"
import { Button } from "@/components/ui/MA_button";
import { Input } from "@/components/ui/MA_input";
import axios from 'axios';
import { getSessionData, handleLogout } from '@/utils/auth';

import { API_BASE_URL } from '@/config/apiConfig';

export default function Seller() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const router = useRouter();

  //seller 페이지 접근통제(취약점 생성!!!)
  useEffect(() => {
    if (auth !== 'SELLER') {
      let redirectTo = '/';
      if (auth === 'ADMIN') {
        redirectTo = '/admin';
      } else if (auth === 'BUYER') {
        redirectTo = '/main';
      }

      alert('접근 권한이 없습니다.');
      router.push(redirectTo).then(() => {
        // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
        window.location.href = redirectTo;
      });
    }
  }, [auth, router]);
  //seller 페이지 접근통제

  const handleLogoutClick = async () => {
    handleLogout(router);
  
    try {
      // 세션 종료 요청
      await axios.post(`${API_BASE_URL}/api/logout`, {
        "key" : key
      });
  
      // 로그아웃 후 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const [selectedSection, setSelectedSection] = useState<string>('s-main');

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
        <img src="/cjj.png" alt="취지직 로고"
          className="w-auto h-12" onClick={() => { window.location.reload(); }} />
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