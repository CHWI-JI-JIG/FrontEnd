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
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Admin() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const [userData, setUsers] = useState<User[]>([]);
  const [selectedRoleTop, setSelectedRoleTop] = useState('BUYER');
  const [selectedRoleIn, setSelectedRoleIn] = useState('');

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleRoleChangeTop = (role: string) => {
    setSelectedRoleTop(role);

    // 선택된 역할에 따라 userData를 필터링
    const filteredUserData = (userData || []).filter(user => user?.userAuth === role) || [];
    setUsers(filteredUserData);
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

  // useEffect(() => {
  //   // 세션 데이터의 key를 서버로 보내어 사용자 데이터를 가져오는 예시
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch('/api/admin', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ key: key }),
  //       });
  //       const data: User[] = await response.json();
  //       if (data && data.length > 0) {
  //         const firstUserAuth = data[0].userAuth;
  //         setSelectedRoleTop(firstUserAuth);
  //         setSelectedRoleIn(firstUserAuth);
  //       }
  //       setUserData(data); // 가져온 사용자 데이터를 상태에 저장
  //     } catch (error) {
  //       console.error('Error fetching user data', error);
  //     }
  //   };

  //   fetchUserData(); // 페이지가 로드될 때 사용자 데이터를 가져오도록 호출
  // }, [key]); // key가 변경될 때마다 호출

  useEffect(() => {
      // POST 요청 body에 담을 데이터
      const requestData = {
      key: key,
      page: page,  // page를 body에 포함
      };

      // POST 요청 설정
      const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      };

      // 서버에 POST 요청 보내기
      fetch('http://192.168.0.132:5000/api/admin', requestOptions)
      .then(response => response.json())
      .then((data: PagedUserList) => {
          console.log('data', data);
          setUsers(data.data);
          setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [key, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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

          <div className="flex flex-col items-center mt-4">
            <div className="flex">
              <Button onClick={handlePrevPage}><FaAngleLeft /></Button>
                <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
              <Button onClick={handleNextPage}><FaAngleRight /></Button>
            </div>
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

interface PagedUserList {
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
  data: User[];
}
