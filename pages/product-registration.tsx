// product-registration.tsx
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/PR_card"
import { Label } from "@/components/ui/PR_label"
import { Input } from "@/components/ui/PR_input"
import { Textarea } from "@/components/ui/PR_textarea"
import { Button } from "@/components/ui/PR_button"
import '@/app/globals.css'

import { useState, ChangeEvent } from 'react';

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
      setPrice(enteredPrice); // 문자열로 저장
    }
  };

  const handleSubmit = () => {
    // 완료 버튼 클릭 시 처리 로직 추가
    // 예: 서버로 데이터 전송 등
    onClose(); // 모달 닫기
  };

  return (
    <div className="bg-gray-800 bg-opacity-50">
      <div className="mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">상품 등록</CardTitle>
              <span className="text-gray-500 text-lg cursor-pointer" onClick={onClose}>X</span>
            </div>
            <CardDescription>아래 정보를 입력하여 상품을 등록해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                  //accept="image/*"
                  className="sr-only"
                  id="file"
                  onChange={handleFileChange}
                />
                <label
                  className="border-dashed border-2 rounded-lg cursor-pointer p-4 flex items-center gap-2 [&:has(:focus)]:outline-none [&:has(:focus)]:ring"
                  htmlFor="file"
                >
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
              <Button onClick={handleSubmit} disabled={!isCompleteEnabled} className={isCompleteEnabled ? '' : 'bg-gray-400'}>완료</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
