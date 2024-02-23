import { Button } from "@/components/ui/MA_button";
import Link from "next/link";
import { Input } from "@/components/ui/MA_input";
import { JSX, SVGProps } from "react";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css";
import axios from "axios";
/* 추가 중 */
import React, { useEffect, useState } from 'react';

export default function Header({ userId }: { userId: string }) {
    const [user, setUser] = useState<User | null>(null)

  // 세션 데이터 가져오기
  useEffect(() => {
    if (userId) {
      axios.post(`https://796d83ff-369b-4a37-a58b-7b99853ce898.mock.pstmn.io/api/get-session`, { userId })
        .then(response => {
          setUser(response.data.data); // 세션 정보를 상태에 저장
        })
        .catch(error => console.error('Error fetching session:', error));
    }
  }, [userId]);

  const handleLogout = () => {
    fetch('https://796d83ff-369b-4a37-a58b-7b99853ce898.mock.pstmn.io/api/logout', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setUser(null); // 로그아웃 시 세션 정보를 초기화
      })
      .catch(error => console.error('Error logging out:', error));
  };

  return (
    <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
      <h1 className="text-3xl font-bold">취지직</h1>
      <div className="flex items-center space-x-2">
        <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요" />
        <Button className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
          <SearchIcon className="text-gray-700" />
        </Button>
      </div>
      <div className="flex space-x-4">
        {user ? (
          <>
            <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
              {user.userName}님
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
  );
}

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