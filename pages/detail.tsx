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

interface User {
  userId: string;
  userName: string;
  email: string;
  login: boolean;
  auth: string;
}

export default function Detail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [qas, setQas] = useState<QA[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { productid } = router.query;

  // handlePurchase 함수 정의
  const handlePurchase = async () => {
    try {
      if (!user || !product) { // product가 null인 경우 처리
        // 사용자가 로그인하지 않은 경우 처리
        return;
      }

      // 수량 정보 가져오기
      const quantity = document.getElementById("quantity") as HTMLSelectElement;
      const selectedQuantity = parseInt(quantity.value);

      // 구매 정보 준비
      const purchaseData = {
        productId: product.productId,
        productName: product.productName,
        quantity: selectedQuantity,
        productPrice: product.productPrice,
        userId: user.userId,
        userName: user.userName
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
        if (productid && typeof productid === 'string') {
          const productResponse = await fetch(`https://be077830-e9ba-4396-b4e7-287ed4373b7b.mock.pstmn.io/api/detail?productid=${productid}`);
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
  }, [productid]);  

  if (!product) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="grid gap-6 lg:gap-12 max-w-6xl mx-auto px-4 py-6">
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

