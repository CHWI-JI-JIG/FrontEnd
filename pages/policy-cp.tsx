import { Label } from "@/components/ui/SU_label"
import { Input } from "@/components/ui/SU_input"
import { Button } from "@/components/ui/SU_button"
import { Separator } from "@/components/ui/SUseparator"
import { useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_BASE_URL } from '@/config/apiConfig';
import "@/app/globals.css"

export default function SignUp() {
  const router = useRouter();
  const [newpasswd, setNewPasswd] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");


  // 회원가입 로직
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 비밀번호 검증 로직
    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidation.test(password)) {
      alert("비밀번호는 8자리 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    // 회원가입 요청
    try {
      const response = await axios.post(`${API_BASE_URL}/api/changePW`, {
        "newPassword": newpasswd,
      });

      if (response.data.success) {
        alert("변경되었습니다.");
        router.push('/login');
      } else {
        alert("변경에 실패했습니다.");
      }
    } catch (error) {
    }
  };


  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">비밀번호 변경</h1>
        <p className="text-gray-500 dark:text-gray-400">취지직은 당신의 개인정보를 소중하게 생각합니다. 비밀번호 변경 기간입니다.</p>
      </div>
      <div>
        <div className="space-y-4">

        <div className="space-y-2">
            <Label htmlFor="password">현재 비밀번호</Label>
            <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newpassword">새로운 비밀번호</Label>
            <Input id="newpassword" required type="password" value={newpasswd} onChange={(e) => setNewPasswd(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input id="passwordConfirm" required type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          </div>

          <Button className="w-full" type="submit" onClick={handleSubmit}>
            가입
          </Button>
          
        </div>
      </div>
    </div>
  )
}