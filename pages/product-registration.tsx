import { useState, ChangeEvent } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/PR_card"
import { Label } from "@/components/ui/PR_label"
import { Input } from "@/components/ui/PR_input"
import { Textarea } from "@/components/ui/PR_textarea"
import { Button } from "@/components/ui/PR_button"
import { SVGProps } from "react"
import "@/app/globals.css";

interface ProductRegistrationProps {
  onClose: () => void;
}

export default function ProductRegistration({ onClose }: ProductRegistrationProps) {
  const [productName, setProductName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('이미지 선택'); // 초기값 설정
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priceErrorMessage, setPriceErrorMessage] = useState<string>('');

  const isPriceValid = price !== '' && parseInt(price) <= 50000000;
  const isCompleteEnabled = productName !== '' && file !== null && isPriceValid && description !== '';
  const sessionKey = typeof window !== 'undefined' ? sessionStorage.getItem('key') : null;
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name); // 파일이 선택되면 파일명을 출력
    }
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredPrice = event.target.value; // 입력된 값을 문자열로 변환
    const parsedPrice = parseInt(enteredPrice);
    if (isNaN(parsedPrice)) { // 숫자가 아닌 경우
      setPriceErrorMessage('숫자만 입력 가능합니다.');
      setPrice('');
    } else if (parsedPrice > 50000000) {
      setPriceErrorMessage('상품 가격은 5천만원을 초과할 수 없습니다.');
      setPrice('');
    } else {
      setPriceErrorMessage('');
      setPrice(enteredPrice);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', price);
    formData.append('productDescription', description);
    if (sessionKey) {
      formData.append('key', sessionKey);
    }
  
    if (file) {
      formData.append('productImagePath', file);
    }
  
    try {
      const response = await fetch('http://192.168.0.112:5000/api/product-registration', {
        method: 'POST',
        body: formData,
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        console.log('상품 등록 성공');
        onClose(); // 모달 닫기
      } else {
        console.log('상품 등록 실패');
      }
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error);
    }
  };
  

  return (
    <div className="bg-gray-800 bg-opacity-50 fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-8 max-w-2xl w-full rounded-lg shadow-lg relative flex flex-col items-center">
        <Button className="absolute top-2 right-2" variant="ghost" onClick={onClose}>
          X
          <span className="sr-only">Close</span>
        </Button>
        <div className="space-y-2 w-full">
          <h3 className="text-lg font-semibold">상품 등록</h3>
          <div className="grid gap-2">
            <Label className="text-base font-bold" htmlFor="name">
              상품명
            </Label>
            <Input id="name" required value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label className="text-base font-bold">상품 대표 이미지</Label>
            <input
              type="file"
              className="sr-only"
              id="file"
              onChange={handleFileChange}
            />
            <label
              className="border-dashed border-2 rounded-lg cursor-pointer p-4 flex items-center gap-2 [&:has(:focus)]:outline-none [&:has(:focus)]:ring"
              htmlFor="file"
            >
              <ImageIcon className="w-6 h-6" />
              <span className="text-sm font-medium">{selectedFileName}</span> {/* 파일명 출력 */}
            </label>
          </div>
          <div className="grid gap-2">
            <Label className="text-base font-bold" htmlFor="price">
              상품 가격
            </Label>
            <Input id="price" required type="number" value={price} onChange={handlePriceChange} />
            {priceErrorMessage && <p style={{ color: 'red' }}>{priceErrorMessage}</p>}
          </div>
          <div className="grid gap-2">
            <Label className="text-base font-bold" htmlFor="description">
              상품 설명
            </Label>
            <Textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {/* 완료 버튼의 활성화 여부에 따라 className 동적으로 설정 */}
        </div>
        <div className="mb-4"></div>
        <Button onClick={handleSubmit} disabled={!isCompleteEnabled} className={isCompleteEnabled ? '' : 'bg-gray-400'}>완료</Button>
      </div>
    </div>
  );
}

function ImageIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}