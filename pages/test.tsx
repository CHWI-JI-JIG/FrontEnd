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

export default function Test() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const [userData, setUserData] = useState<User[] | null>(null);
  const [selectedRoleTop, setSelectedRoleTop] = useState('ALL');
  const [selectedRoleIn, setSelectedRoleIn] = useState('');

  // User 타입으로 dummyData 정의
  const dummyData: User[] = [
    { userUUID: '1', userId: 'user1', userAuth: 'SELLER' },
    { userUUID: '2', userId: 'user2', userAuth: 'BUYER' },
    { userUUID: '3', userId: 'user3', userAuth: 'SELLER' },
    { userUUID: '4', userId: 'user4', userAuth: 'BUYER' },
    { userUUID: '5', userId: 'user5', userAuth: 'SELLER' },
    { userUUID: '6', userId: 'user6', userAuth: 'BUYER' },
    { userUUID: '7', userId: 'user7', userAuth: 'SELLER' },
    { userUUID: '8', userId: 'user8', userAuth: 'BUYER' },
    { userUUID: '9', userId: 'user9', userAuth: 'SELLER' },
    { userUUID: '10', userId: 'user10', userAuth: 'BUYER' },
    { userUUID: '11', userId: 'user11', userAuth: 'SELLER' },
    { userUUID: '12', userId: 'user12', userAuth: 'BUYER' },
    // 더 많은 더미 데이터를 추가할 수 있습니다.
  ];

  const handleRoleChangeTop = (role: string) => {
    setSelectedRoleTop(role);

    // 선택된 역할에 따라 userData를 필터링
    let filteredUserData: User[] = [];
    if (role === 'ALL') {
      // All을 선택한 경우 모든 데이터를 보여줍니다.
      filteredUserData = dummyData;
    } else {
      // 선택된 역할에 맞게 데이터를 필터링합니다.
      filteredUserData = (dummyData || []).filter((user: User) => user?.userAuth === role) || [];
    }

    setUserData(filteredUserData);
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
        if (dummyData && dummyData.length > 0) {
          const firstUserAuth = dummyData[0].userAuth;
          setSelectedRoleTop(firstUserAuth);
          setSelectedRoleIn(firstUserAuth);
        }
        setUserData(dummyData); // 더미 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData(); // 페이지가 로드될 때 사용자 데이터를 가져오도록 호출
  }, []); // 더미 데이터를 한 번만 가져오도록 빈 배열을 전달
  
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex flex-col">
        <header className="flex items-center justify-between py-6 px-6 gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <a className="text-3xl font-bold mb-4 mt-4">취지직 관리자 페이지</a>
          <div className="flex space-x-4">
            <Button className="text-black bg-[#F1F5F9] hover.bg-[#D1D5D9]" variant="ghost">
              관리자님
            </Button>
            <Button className="text-black bg-[#F1F5F9] hover.bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
              <Link href="/login">로그아웃</Link>
            </Button>
          </div>
        </header>
        <main className="flex flex-col gap-2 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-end w-full">
            <div className="relative w-1/5">
              <Select value={selectedRoleTop} onValueChange={(role) => handleRoleChangeTop(role)}>
                <SelectTrigger>
                  {selectedRoleTop === 'ALL' ? 'ALL' : selectedRoleTop === 'SELLER' ? 'SELLER' : 'BUYER'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
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
                          <Select value={user.userAuth} onValueChange={(role) => handleRoleChangeIn(role)}>
                            <SelectTrigger>
                              {user.userAuth === 'SELLER' ? 'SELLER' : 'BUYER' }
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
  );
}

interface User {
  userUUID: string;
  userId: string;
  userAuth: string;
}
