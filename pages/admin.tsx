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
import { API_BASE_URL } from '@/config/apiConfig';
import router from "next/router";

export default function Admin() {
  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();

  const [userData, setUsers] = useState<User[]>([]);
  const [allUserData, setAllUsers] = useState<User[]>([]);
  const [selectedRoleTop, setSelectedRoleTop] = useState('all');
  const [selectedRoleIn, setSelectedRoleIn] = useState('');

  const [selectedUserKey, setSelectedUserKey] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!certification || auth !== 'ADMIN') {
        // 세션이 인증되지 않았거나 판매자가 아닌 경우 알림 표시 후 서버에서 메인 페이지로 리디렉션
        alert('관리자 로그인이 필요합니다.');
        router.push('/').then(() => {
            // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
            window.location.href = '/';
        });
    }
  }, []);

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

  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
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
        console.log("admin:",data.data)
        setAllUsers(data.data); // 전체 데이터 업데이트
        setUsers(data.data);    // 현재 필터링된 데이터 업데이트
        setTotalPages(data.totalPage);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [key, page]);

  //

  useEffect(() => {
    // selectedRoleIn 또는 selectedUserKey 값이 변경될 때마다 호출
    if (selectedRoleIn && selectedUserKey) {
      handleRoleSubmit(selectedRoleIn, selectedUserKey);
    }
  }, [selectedRoleIn, selectedUserKey]);

  const handleRoleChangeIn = (role: string, userKey: string) => {
    console.log('handleRoleChangeIn - role:', role, 'userKey:', userKey);
    setSelectedRoleIn(role);
    setSelectedUserKey(userKey);
  };
  

  const handleRoleSubmit = (role: string, userKey: string) => {
    console.log('handleRoleSubmit - selectedRoleIn:', selectedRoleIn, 'userKey:', userKey);
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
                  userData.map((user) => (
                    <TableRow key={user.userKey}>
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className='w-full'>
                          <Select value={user.userAuth} onValueChange={(role) => {
                              console.log('Select - onValueChange - role:', role, 'user.key:', user.userKey);
                              handleRoleChangeIn(role, user.userKey);
                            }}>
                            <SelectTrigger>
                              {user.userAuth === 'seller' ? 'seller' : 'buyer' }
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
