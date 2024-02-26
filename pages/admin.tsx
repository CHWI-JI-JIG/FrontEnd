import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/AD_select"
import { Button } from "@/components/ui/AD_button"
import Link from "next/link"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/AD_dropdown-menu"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/AD_table"
import { Switch } from "@/components/ui/AD_switch"
import { useEffect, useState } from 'react';
import axios from 'axios';
import "@/app/globals.css";

interface User {
  userName: string;
  userId: string;
  userPhone: string;
  userAuth: 'seller' | 'buyer'; // userAuth는 seller, buyer 중 하나여야 합니다.
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // 세션 키가 들어있는 JSON 데이터
    const sessionData = {
      "session.key": "세션키값"
    };

    // 세션 키를 백엔드로 전송하여 사용자 정보를 받아옵니다.
    axios.post('/api/admin', sessionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // 성공적으로 사용자 정보를 받아왔을 때의 처리
      console.log(response.data); // 받아온 사용자 정보 출력
      setUsers(response.data.users); // 받아온 사용자 정보를 상태에 저장
    })
    .catch(error => {
      // 요청이 실패했을 때의 처리
      console.error('Error fetching user data:', error);
    });
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행되도록 빈 배열을 useEffect의 두 번째 인자로 전달

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex flex-col">
      
      <header className="flex items-center justify-between py-6 px-6 gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <a className="text-3xl font-bold mb-4 mt-4">취지직 관리자 페이지</a>
        <div className="flex space-x-4">
          <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
            관리자님
          </Button>
          <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
            <Link href="/privacy-policy">로그아웃</Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-col gap-2 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-end w-full">
          <div className="relative w-1/5">
            <Select defaultValue="seller">
              <SelectTrigger>
                <SelectValue>Role</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">이름</TableHead>
                  <TableHead className="hidden md:table-cell">아이디</TableHead>
                  <TableHead className="min-w-[150px]">전화번호</TableHead>
                  <TableHead className="hidden md:table-cell">계정 상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center">
                      <span className="ml-2 font-medium">{user.userName}</span>
                    </TableCell>
                    <TableCell className="font-medium">{user.userId}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.userPhone}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Switch className="mx-auto" defaultChecked={user.userAuth === 'seller'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
