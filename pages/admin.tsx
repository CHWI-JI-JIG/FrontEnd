import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/AD_select";
import { Input } from "@/components/ui/AD_input"
import { Button } from "@/components/ui/AD_button"
import Link from "next/link"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/AD_dropdown-menu"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/AD_table"
import { Switch } from "@/components/ui/AD_switch"
import "@/app/globals.css";
import { getSessionData } from '@/utils/auth'
import { useEffect, useState } from 'react';

export default function admin() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedRoleTop, setSelectedRoleTop] = useState('BUYER');
  const [selectedRoleIn, setSelectedRoleIn] = useState('');

  const handleRoleChangeTop = (role: string) => {
    setSelectedRoleTop(role);
  };

  const handleRoleChangeIn = (role: string) => {
    setSelectedRoleIn(role);
  };

  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    // 세션 데이터의 key를 서버로 보내어 사용자 데이터를 가져오는 예시
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUserData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: key }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
          const firstUserAuth = data[0].userAuth;
          setSelectedRoleTop(firstUserAuth);
          setSelectedRoleIn(firstUserAuth);
        }
        setUserData(data); // 가져온 사용자 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData(); // 페이지가 로드될 때 사용자 데이터를 가져오도록 호출
  }, [key]); // key가 변경될 때마다 호출


  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex flex-col">
      
      <header className="flex items-center justify-between py-6 px-6 gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <a className="text-3xl font-bold mb-4 mt-4">취지직 관리자 페이지</a>
        <div className="flex space-x-4">
          <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
            관리자님
          </Button>
          <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
            <Link href="/login">로그아웃</Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-col gap-2 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-end w-full">
          <div className="relative w-1/5">
            <Select value={selectedRoleTop} onValueChange={(role) => handleRoleChangeTop(role)}>
              <SelectTrigger>
                {selectedRoleTop === 'SELLER' ? 'SELLER' : 'BUYER'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELLER">SELLER</SelectItem>
                <SelectItem value="BUYER">BUYER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">아이디</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData && userData.length > 0 ? (
                  userData.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className='w-full'>
                          <Select value={selectedRoleIn} onValueChange={(role) => handleRoleChangeIn(role)}>
                            <SelectTrigger>
                              {selectedRoleIn === 'SELLER' ? 'SELLER' : 'BUYER' }
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SELLER">SELLER</SelectItem>
                              <SelectItem value="BUYER">BUYER</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Switch className="mx-auto" defaultChecked />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">사용자가 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}

interface User {
  map(arg0: (user: any) => import("react").JSX.Element): import("react").ReactNode;
  length: number;
  userUUID: string;
  userId: string;
  userAuth: string;
}