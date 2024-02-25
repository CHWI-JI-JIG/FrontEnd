import { Button } from "@/components/ui/MA_button";
import Link from "next/link";
import { Input } from "@/components/ui/MA_input";
import { JSX, SVGProps } from "react";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "@/app/globals.css";
import axios from "axios";
/* 추가 중 */
import React, { useEffect, useState } from 'react';
import router from "next/router";

export default function Header({ userId, onSearch }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 세션 데이터 가져오기
  useEffect(() => {
    if (userId) {
      axios.post(`http://172.30.1.32:9988/api/get-session`, { userId })
        .then(response => {
          setUser(response.data.data); // 세션 정보를 상태에 저장
        })
        .catch(error => console.error('Error fetching session:', error));
    }
  }, [userId]);

  const handleLogout = () => {
    fetch('http://172.30.1.32:9988/api/logout', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setUser(null); // 로그아웃 시 세션 정보를 초기화
      })
      .catch(error => console.error('Error logging out:', error));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출의 기본 동작 막기
    onSearch(searchQuery);

    // 라우터 라이브러리를 사용하여 URL 업데이트
    router.push(`/search?keyword=${searchQuery}&page=1`);
  };

  return (
    <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
      <Link href="/">
        <a className="text-3xl font-bold">취지직</a>
      </Link>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요" 
          value={searchQuery} onChange={handleSearchChange} />
        <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
          <SearchIcon className="text-gray-700" />
        </Button>
      </form>
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
  );
}

interface HeaderProps {
  userId: string;
  onSearch: (keyword: string) => void;
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