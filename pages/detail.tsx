import Header from './header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Label } from "@/components/ui/DE_label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/DE_select";
import axios from 'axios';
import { Button } from "@/components/ui/DE_button";
import "@/app/globals.css";

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

export default function Detail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductCount, setSelectedProductCount] = useState<string>("1"); // quantity를 selectedProductCount로 변경
  const [userId, setUserId] = useState<string | null>(null); // 사용자 아이디 상태 추가
  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    if (productId && typeof productId === 'string') {
      fetchData();
    } else {
      setLoading(false); // productId가 없으면 로딩 상태 변경
    }
  }, [productId]);

  useEffect(() => {
    // 데이터를 가져온 후에 로딩 및 상품 존재 여부 검증
    if (product) {
      if (loading) {
        console.log("로딩 중...");
      }
      return;
    }

    console.log("잘못된 접근입니다.");
  }, [product, loading]);

  const fetchData = async () => {
    setLoading(true); // 로딩 상태 변경
    try {
      // productId가 유효한 경우에만 상품 및 QA 정보 요청
      const productResponse = await fetch(`https://be077830-e9ba-4396-b4e7-287ed4373b7b.mock.pstmn.io/api/detail?productId=${productId}`);
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
      setLoading(false); // 로딩 상태를 여기서 변경
    }
  };

  const handlePurchase = async () => {
    try {
      if (!product) {
        return; // 제품이 로드되지 않은 경우 처리
      }
  
      // 세션 정보 요청
      const sessionResponse = await axios.post('https://796d83ff-369b-4a37-a58b-7b99853ce898.mock.pstmn.io/api/get-session', {});
      const sessionData = sessionResponse.data;
  
      const userId = sessionData.data.userId; // 직접 userId 변수에 할당
  
      console.log("userid=", userId);
      if (!userId) {
        // 사용자 아이디가 없으면 로그인 페이지로 이동
        return;
      }
  
      // 사용자 아이디가 존재하는 경우에만 구매 요청 처리
      // 구매 정보 준비
      const purchaseData = {
        productId: product.productId,
        productName: product.productName,
        productCount: parseInt(selectedProductCount),
        productPrice: product.productPrice,
        userId: userId // 세션 정보 userId
      };
  
      // 서버에 구매 요청 보내기
      const purchaseResponse = await axios.post('https://be077830-e9ba-4396-b4e7-287ed4373b7b.mock.pstmn.io/api/temppayment', purchaseData);
  
      // 구매 요청 결과 처리
      console.log("구매 요청:",purchaseResponse.data);
  
    } catch (error) {
      console.error('Error purchasing product:', error);
    }
  };
  
  
  if (loading) {
    return <div>로딩 중...</div>; // 데이터를 가져오는 동안 로딩 상태를 표시
  }

  if (!product) {
    return <div>잘못된 접근입니다.</div>; // URL에 product 파라미터가 없을 때
  }
  return (
    <div className="grid gap-6 lg:gap-12 max-w-6xl mx-auto px-4 py-6">
      <Header />
      <div className="grid md:grid-cols-2 md:gap-6 items-start">
        <div>
          <img
            alt="Product Image"
            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
            height={600}
            src={product.productImageUrl}
            width={600}
          />
        </div>
        <div className="flex flex-col gap-4 md:gap-8">
          <h1 className="font-bold text-2xl sm:text-3xl">{product.productName}</h1>
          <div className="text-4xl font-bold">{product.productPrice}</div>
          <p>{product.productDescription}</p>
          <div className="grid gap-4 md:gap-8">
            <form className="grid gap-4 md:gap-8">
              <div className="grid gap-2">
                <Label className="text-base" htmlFor="quantity">
                  수량
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" onClick={handlePurchase}>구매하기</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <h2 className="font-bold text-lg mb-2">Q&A</h2>
        <Button>Q&A 작성</Button>
      </div>
      <div className="grid gap-4">
        {qas.map((qa, index) => (
          <div key={index} className="text-sm">
            <h3 className="font-medium">{qa.question}</h3>
            <p>{qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

