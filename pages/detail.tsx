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
      if (!user || !product) { // product가 null인 경우 처리
        // 사용자가 로그인하지 않은 경우 처리
        return;
      }
      const purchaseData = {
        productId: product.productId,
        productName: product.productName,
        productCount: parseInt(selectedProductCount),
        productPrice: product.productPrice,
        userId: userId
      };

      // 서버에 구매 요청 보내기
      const purchaseResponse = await axios.post('https://your-server-url/purchase', purchaseData);

      // 구매 요청 결과 처리
      console.log(purchaseResponse.data); // 구매 요청 결과 출력 또는 다른 작업 수행

    } catch (error) {
      console.error('Error purchasing product:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 세션 정보 요청
        const sessionResponse = await axios.post('https://796d83ff-369b-4a37-a58b-7b99853ce898.mock.pstmn.io/api/get-session', {});
        const sessionData = sessionResponse.data;
        console.log(sessionData);

        setUser(sessionData.data); // 세션 정보 중에서 사용자 정보만 가져와 저장

        // 상세 페이지 url에서 파라미터로 productid 존재 유무 확인 후 상품, QA api 요청
        if (productId && typeof productId === 'string') {
          const productResponse = await fetch(`https://be077830-e9ba-4396-b4e7-287ed4373b7b.mock.pstmn.io/api/detail?productId=${productId}`);
          const productData = await productResponse.json();
          const { product, QA } = productData;
          if (product && QA) {
            setProduct(product);
            setQas(QA);
          } else {
            // 에러 처리
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <Link href="/">
          <a className="text-3xl font-bold">취지직</a>
        </Link>
        {/* <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"/>
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost">
            <SearchIcon className="text-gray-700" />
          </Button>
        </div> */}
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-4xl mb-2">Q&A</h2>
          <Button onClick={openModal}>Q&A 작성</Button>
        </div>

        <div>
          {qas.map((qa, index) => (
            <div key={index} className="text-sm" style={{ margin: '10px 0' }}>
              <div className="border-b border-gray-300 pb-4">
                <h3 className="font-medium text-lg">Q. {qa.question}</h3>
                {qa.answer !== "" && (
                  <p className="text-gray-500">A. {qa.answer}</p>
                )}
              </div>
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