import { useState, useEffect, SVGProps } from 'react';
import { useRouter } from 'next/router';
import { Input } from "@/components/ui/MA_input"
import { Label } from "@/components/ui/DE_label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/DE_select";
import axios from 'axios';
import { Button } from "@/components/ui/DE_button";
import "@/app/globals.css";
import QaModal from './qa-modal'; // qa-modal 컴포넌트를 불러옵니다.
import Link from "next/link"

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  productDescription: string;
}

interface QA {
  qId: string;
  question: string;
  answer: string;
}
interface User {
  userId: string;
  userName: string;
  email: string;
  login: boolean;
  auth: string;
}

// 가격 포맷 함수
const numberWithCommas = (number: number) => {
  return number.toLocaleString();
};

export default function Detail({ userId }: { userId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProductCount, setSelectedProductCount] = useState<string>("1");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 추가 
  const router = useRouter();
  const { productId } = router.query;

  // 세션 데이터 가져오기
  useEffect(() => {
    if (userId) {
      axios.post(`http://192.168.0.132:9988/api/get-session`, { userId })
        .then(response => {
          setUser(response.data.data); // 세션 정보를 상태에 저장
        })
        .catch(error => console.error('Error fetching session:', error));
    }
  }, [userId]);

  const handleLogout = () => {
    fetch('http://192.168.0.132:9988/api/logout', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setUser(null); // 로그아웃 시 세션 정보를 초기화
      })
      .catch(error => console.error('Error logging out:', error));
  };

  useEffect(() => {
    if (!productId) {
      console.log("잘못된 접근...");
      return;
    }
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productResponse = await fetch(`http://192.168.0.132:9988/api/detail?productId=${productId}`);
      const productData = await productResponse.json();
      const { product, QA } = productData;
      if (product && QA) {
        setProduct(product);
        setQas(QA);
      } else {
        // 에러 처리
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      if(!user){
        //로그인 페이지로 이동
        router.push('/login');
        return;
      }
      if (!product) {
        return;
      }
      const sessionResponse = await axios.post('http://192.168.0.132:9988/api/get-session', {});
      const sessionData = sessionResponse.data;
      setUser(sessionData.data);
      console.log("userid=", user.userId);
      if (!userId) {
        return;
      }
      const purchaseData = {
        productId: product.productId,
        productName: product.productName,
        productCount: parseInt(selectedProductCount),
        productPrice: product.productPrice,
        userId: userId
      };
      const purchaseResponse = await axios.post('http://192.168.0.132:9988/api/temppayment', purchaseData);
      console.log("구매 요청:", purchaseResponse.data);
    } catch (error) {
      console.error('Error purchasing product:', error);
    }
  };

  const handleSelectChange = (selectedValue: string) => {
    setSelectedProductCount(selectedValue);
    console.log("Selected product count:", selectedValue);
  };

  // 모달 열기 함수
  const openModal = () => {
    /*if(!user){
      router.push('/login');
      return;
    }*/
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    console.log("로딩 중...");
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#212121]">
        <Link href="/">
          <a className="text-3xl font-bold">취지직</a>
        </Link>
        <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"/>
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
            <SearchIcon className="text-gray-700" />
          </Button>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/mypage">{user.userName}님</Link>
              </Button>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/login">로그인</Link>
              </Button>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                <Link href="/privacy-policy">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="my-6 mx-6">
        <div className="grid md:grid-cols-2 md:gap-6 items-start">
          <div>
          <img
            alt="Product Image"
            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
            height={200}
            src={product.productImageUrl}
            width={200}
          />
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <h1 className="font-bold text-2xl sm:text-3xl">{product.productName}</h1>
            <div className="text-4xl font-bold">{numberWithCommas(product.productPrice)}</div> {/* 가격 포맷 */}
            <p>{product.productDescription}</p>
            <div className="grid gap-4 md:gap-8">
              <form className="grid gap-4 md:gap-8">
                <div className="grid gap-2">
                  <Label className="text-base" htmlFor="quantity">
                    수량
                  </Label>
                  <select defaultValue="1" onChange={(e) => handleSelectChange(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <Button size="lg" onClick={handlePurchase}>구매하기</Button>
              </form>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600"/> {/* 구분선 */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg mb-2">Q&A</h2>
          <Button onClick={openModal}>Q&A 작성</Button> {/* Q&A 작성 버튼 */}
        </div>

        <div className="grid gap-4">
          {qas.map((qa, index) => (
            <div key={index} className="text-sm">
              <h3 className="font-medium">{qa.question}</h3>
              <p>{qa.answer}</p>
            </div>
          ))}
        </div>
        {isModalOpen && <QaModal closeModal={closeModal} userId={userId} productId={productId as string} />}
      </div>
    </div>
  );
  
  function SearchIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
  }
}