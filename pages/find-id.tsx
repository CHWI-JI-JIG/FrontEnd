import { Label } from "@/components/ui/SU_label"
import { Input } from "@/components/ui/SU_input"
import { Button } from "@/components/ui/SU_button"
import { useState } from 'react';
import axios from "axios";
import { useRouter } from "next/router";
import { API_BASE_URL } from '@/config/apiConfig';
import "@/app/globals.css"

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");


  // //아이디 중복 검사
  // const checkId = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/api/find-email?id=${email}`);
  //     if (response.data.duplicated) {
  //       alert("메일을 확인해 주시기 바립니다..");
  //     } else {
  //       alert("이 메일로 계정이 등록되지 않았습니다.");
  //     }
  //   } catch (error) {
  //   }
  // };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    // 이메일 검증 로직
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValidation.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    // 회원가입 요청
    try {
      const response = await axios.post(`${API_BASE_URL}/api/sendmail`, {
        "userEmail": email,
  
      });

      if (response.data.success) {
        alert("메일을 확인해 주시기 바랍니다.");
        router.push('/login');
      } else {
        alert("이 이메일로 가입한 계정이 존재하지 않습니다.");
      }
    } catch (error) {
    }
  };

  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">계정 찾기</h1>
        <p className="text-gray-500 dark:text-gray-400">취지직에 가입한 이메일을 입력해 주시기 바립니다.</p>
      </div>
      <div>
        <div className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="m@example.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>


          <Button className="w-full" type="submit" onClick={handleSubmit}>
            계정 찾기
          </Button>

        </div>
      </div>
    </div>
  )
}