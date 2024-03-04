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
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // 아이디 중복 검사
  const checkId = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/check-id?id=${id}`);
      if (response.data.duplicated) {
        alert("중복된 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

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

    // 전화번호 검증 로직
    const phoneValidation = /^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}$/;;
    if (!phoneValidation.test(phone)) {
      alert("전화번호는 10자리 또는 11자리의 숫자여야 합니다.");
      return;
    }

    // 이메일 검증 로직
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValidation.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    // 회원가입 요청
    try {
      const response = await axios.post(`${API_BASE_URL}/api/signup`, {
        "buyerId": id,
        "buyerPassword": password,
        "buyerName": name,
        "buyerPhone": phone,
        "buyerEmail": email,
        "buyerAddress": address,
      });

      if (response.data.success) {
        alert("회원가입이 완료되었습니다.");
        router.push('/login');
      } else {
        alert("회원가입에 실패하였습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">회원가입</h1>
        <p className="text-gray-500 dark:text-gray-400">취지직은 여러분을 환영합니다.</p>
      </div>
      <div>
        <div className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="id">아이디</Label>
            <div className="flex items-center">
              <Input id="id" required className="w-64" value={id} onChange={(e) => setId(e.target.value)} />
              <button className="ml-2 bg-gray-500 text-white py-2 px-6 rounded" onClick={checkId}>검증</button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input id="passwordConfirm" required type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="m@example.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <Button className="w-full" type="submit" onClick={handleSubmit}>
            가입
          </Button>
          <Link href="/b-sign-up">사업자로 가입하기</Link>
          <Separator className="my-8" />
          <div className="space-y-4">
            <Button className="w-full" variant="outline">
              Google로 회원가입하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}