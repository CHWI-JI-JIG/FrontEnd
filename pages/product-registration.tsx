import { useState, ChangeEvent } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/PR_card"
import { Label } from "@/components/ui/PR_label"
import { Input } from "@/components/ui/PR_input"
import { Textarea } from "@/components/ui/PR_textarea"
import { Button } from "@/components/ui/PR_button"
import { SVGProps } from "react"
import { API_BASE_URL } from '@/config/apiConfig';
import "@/app/globals.css";

interface ProductRegistrationProps {
  onClose: () => void;
}

export default function ProductRegistration({ onClose }: ProductRegistrationProps) {
  const [productName, setProductName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('이미지 선택');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priceErrorMessage, setPriceErrorMessage] = useState<string>('');

  const isPriceValid = price !== '' && parseInt(price) <= 50000000;
  const isCompleteEnabled = productName !== '' && file !== null && isPriceValid && description !== '';
  const sessionKey = typeof window !== 'undefined' ? sessionStorage.getItem('key') : null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // 파일 선택 이벤트가 발생했을 때 호출되었는지 확인
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      // 선택된 파일이 존재할 경우 파일 상태 업데이트
      setFile(selectedFile);
      // 선택된 파일명을 출력하여 확인
      setSelectedFileName(selectedFile.name);
    }
  };


  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredPrice = event.target.value;
    const parsedPrice = parseInt(enteredPrice);
    if (isNaN(parsedPrice)) {
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

  // 프론트엔드 코드 수정
  const handleSubmit = async () => {
    // 선택된 파일이 있는지 확인
    if (file) {
      // 선택된 파일이 있는 경우에만 FormData 생성
      const formData = new FormData();

      formData.append('productName', productName);
      formData.append('productPrice', price);
      formData.append('productDescription', description);
      formData.append('file', file); // 파일을 FormData에 추가

      if (sessionKey) {
        formData.append('key', sessionKey);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/product-registration`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          onClose();
          window.location.reload();
        } else {
          alert('상품 등록에 실패했습니다.');
        }
      } catch (error) {
        alert('상품 등록 중 오류가 발생했습니다.');
      }
    } else {
      alert("잠시후 다시 시도해주시기 바랍니다.")
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
              className="border-dashed border-2 rounded-lg cursor-pointer p-4 flex items-center gap-2 focus:outline-none focus:ring"
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