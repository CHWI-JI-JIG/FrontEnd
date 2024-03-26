import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/AD_select";
import { Input } from "@/components/ui/AD_input"
import { Button } from "@/components/ui/AD_button"
import Link from "next/link"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/AD_dropdown-menu"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/AD_table"
import { Switch } from "@/components/ui/AD_switch"
import "@/app/globals.css";
import { getSessionData, handleLogout } from '@/utils/auth'
import { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { API_BASE_URL } from '@/config/apiConfig';
import { useRouter } from 'next/router';
import { handleNextPage, handlePrevPage } from '@/utils/commonUtils';

import axios from "axios";

export default function Admin() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  const router = useRouter();

  // //admin 페이지 접근통제(취약점 생성!!!)
  // useEffect(() => {
  //   if (auth !== 'ADMIN') {
  //     let redirectTo = '/'; 
  //     if (auth === 'SELLER') {
  //       redirectTo = '/seller';
  //     } else if (auth === 'BUYER') {
  //       redirectTo = '/main';
  //     }

  //     alert('접근 권한이 없습니다.');
  //     router.push(redirectTo).then(() => {
  //       // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
  //       window.location.href = redirectTo;
  //     });
  //   }
  // }, [auth,router]);
  // //admin 페이지 접근통제

  const [userData, setUsers] = useState<User[]>([]);
  const [allUserData, setAllUsers] = useState<User[]>([]);
  const [selectedRoleTop, setSelectedRoleTop] = useState('all');
  const [selectedRoleIn, setSelectedRoleIn] = useState('');

  const [selectedUserKey, setSelectedUserKey] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleRoleChangeTop = (role: string) => {
    setSelectedRoleTop(role);

    // 선택된 역할에 따라 allUserData를 필터링
    let filteredUserData: User[] = [];
    if (role === 'all') {
      // All을 선택한 경우 모든 데이터를 보여줍니다.
      filteredUserData = allUserData;
    } else {
      // 선택된 역할에 맞게 데이터를 필터링합니다.
      filteredUserData = allUserData.filter((user: User) => user?.userAuth === role) || [];
    }

    setUsers(filteredUserData);
  };

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

  useEffect(() => {
    // POST 요청 body에 담을 데이터
    const requestData = {
      key: key,
      page: page,  // page를 body에 포함
    };
    console.log('데이터 조회 시 Request key : ', key)

    // POST 요청 설정
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    // 서버에 POST 요청 보내기
    fetch(`${API_BASE_URL}/api/admin`, requestOptions)
      .then(response => response.json())
      .then((data: PagedUserList) => {
        console.log("admin:", data.data)
        setAllUsers(data.data); // 전체 데이터 업데이트
        setUsers(data.data);    // 현재 필터링된 데이터 업데이트
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [key, page]);

  useEffect(() => {
    // selectedRoleIn 또는 selectedUserKey 값이 변경될 때마다 호출
    if (selectedRoleIn && selectedUserKey) {
      handleRoleSubmit(selectedRoleIn, selectedUserKey);
    }
  }, [selectedRoleIn, selectedUserKey]);

  const handleRoleChangeIn = (role: string, userKey: string) => {
    setSelectedRoleIn(role);
    setSelectedUserKey(userKey);
  };


  const handleRoleSubmit = (role: string, userKey: string) => {
    // 선택된 값이 없다면 아무 동작도 하지 않음
    if (!selectedRoleIn || !userKey) return;

    // POST 요청 body에 담을 데이터
    const requestData = {
      userKey: userKey,
      userAuth: selectedRoleIn,
    };
    console.log('role change 전송 data:', requestData);

    // POST 요청 설정
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    // 서버에 POST 요청 보내기
    fetch(`${API_BASE_URL}/api/user-role`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        console.log("user-role:", data.data)
        if (data.success) {
          alert('권한 변경 성공');

          // 전체 데이터 업데이트
          setAllUsers(prevUsers => {
            return prevUsers.map(user => {
              if (user.userKey === userKey) {
                return {
                  ...user,
                  userAuth: role,
                };
              }
              return user;
            });
          });

          // 현재 필터링된 데이터 업데이트
          setUsers(prevUsers => {
            // selectedRoleTop이 'all'이면 업데이트된 사용자를 다시 목록에 추가
            if (selectedRoleTop === 'all') {
              return prevUsers.map(user => {
                if (user.userKey === userKey) {
                  return {
                    ...user,
                    userAuth: role,
                  };
                }
                return user;
              });
            } else {
              // selectedRoleTop이 'all'이 아닌 경우 변경된 사용자를 현재 필터링된 목록에서 제외
              return prevUsers.filter(user => user.userKey !== userKey);
            }
          });
        } else {
          alert('권한 변경 실패..잠시 후 다시 시도해주세요.')
        }
      })
      .catch(error => console.error('Error updating user role:', error));
  };

  const handleNext = () => handleNextPage(page, totalPages, setPage);
  const handlePrev = () => handlePrevPage(page, setPage);

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex flex-col">
        <header className="flex items-center justify-between py-6 px-6 gap-4 border-b text-white bg-[#121513] px-6 dark:bg-gray-800/40">
          <div className="flex items-center space-x-4">
            <img src="/cjj.png" alt="취지직 로고" className="w-auto h-12" />
            <a className="text-3xl font-bold mb-4 mt-4">관리자 페이지</a>
          </div>
          <div className="flex space-x-4">
            <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
              관리자님
            </Button>
            <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogoutClick}>
              <Link href="/login">로그아웃</Link>
            </Button>
          </div>
        </header>

        <main className="flex flex-col gap-2 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-end w-full">
            <div className="relative w-1/5">
              <Select value={selectedRoleTop} onValueChange={(role) => handleRoleChangeTop(role)}>
                <SelectTrigger>
                  {selectedRoleTop === 'all' ? 'all' : selectedRoleTop === 'seller' ? 'seller' : 'buyer'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="seller">seller</SelectItem>
                  <SelectItem value="buyer">buyer</SelectItem>
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
                  userData
                    .filter((user) => user.userAuth !== 'admin') // 'admin'인 경우 제외
                    .map((user) => (
                      <TableRow key={user.userKey}>
                        <TableCell className="font-medium">{user.userId}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className='w-full'>
                            <Select value={user.userAuth} onValueChange={(role) => handleRoleChangeIn(role, user.userKey)}>
                              <SelectTrigger>
                                {user.userAuth === 'seller' ? 'seller' : 'buyer'}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seller">seller</SelectItem>
                                <SelectItem value="buyer">buyer</SelectItem>
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

          {totalPages > 0 && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex">
                <Button onClick={handlePrev}><FaAngleLeft /></Button>
                <span className="mx-4">{`페이지 ${page} / ${totalPages}`}</span>
                <Button onClick={handleNext}><FaAngleRight /></Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface User {
  userKey: string;
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
