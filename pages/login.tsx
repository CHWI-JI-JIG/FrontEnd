import { useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/Lo_label"
import { Input } from "@/components/ui/Lo_input"
import Link from "next/link"
import { Button } from "@/components/ui/Lo_button"
import { useRouter } from "next/router";
import "@/app/globals.css"
import { setSessionData } from '@/utils/auth';

export default function Login() {
  const router  = useRouter();
  // 입력값 상태 관리
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 로직
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 로그인 요청
    try {
      const response = await axios.post("http://192.168.0.112:5000/api/login", {
        "userId":id,
        "userPassword":password,
      });

      if (response.data.success) {
        alert("로그인에 성공하였습니다.");
        
        // 로그인 성공 후 처리 로직(예: 페이지 이동)을 추가할 수 있습니다.
        const {auth, certification, name, key} = response.data;
        setSessionData({ auth, certification, key, name });

        //auth에 따른 페이지 이동
        if (auth === 'BUYER') {
          router.push('/main');
        } else if (auth === 'SELLER') {
          router.push('/seller');
        } else if (auth === 'ADMIN') {
          router.push('/admin');
        } else {
          alert("알 수 없는 권한입니다.");
        }
      } else {
        alert("로그인에 실패하였습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="mx-auto space-y-6 max-w-[400px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">취지직</h1>
          <p className="text-gray-500 dark:text-gray-400">취지직 쇼핑몰에 오신 여러분을 환영합니다.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">아이디</Label>
            <Input id="id" placeholder="" required value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">패스워드</Label>
            </div>
            <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" type="submit" onClick={handleSubmit}>
           로그인
          </Button>
          <Button className="w-full" variant="outline">
            Google로 로그인하기(개발중)
          </Button>
        </div>
      </div>
    </div>
  )
}