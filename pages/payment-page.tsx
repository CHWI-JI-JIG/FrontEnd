import { CardTitle, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/PayP_card"
import { Button } from "@/components/ui/PayP_button"
import Link from "next/link"
import { Label } from "@/components/ui/PayP_label"
import { Input } from "@/components/ui/PayP_input"
import { SVGProps } from "react"
import React, { useEffect, useState } from "react"
import axios from "axios"
import "@/app/globals.css"

export default function PaymentPage() {

    const [userData, setUserData] = useState({
        name: '',
        userId: '',
        phone: '',
        address: '',
        cardNum: [],
        point: 0
    });

    const [product, setProduct] = useState({
        productName: '',
        productCount: 0,
        productPrice: 0,
    });
    const [finalPrice, setFinalPrice] = useState(0);
    useEffect(() => {
        const fetchUserData = async () => {
            const result = await axios.post('http://172.30.1.32:9988/api/c-user', {});
            setUserData(result.data);
            console.log(result.data)
        };

        const fetchProductData = async () => {
            const response = await axios.post('http://172.30.1.32:9988/api/product-trans');
            setProduct(response.data);
            setFinalPrice(response.data.productPrice)
            console.log(response.data)
        };


        fetchUserData();
        fetchProductData();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;

        // 전화번호 필드에 대해서만 정규식을 적용합니다.
        if (id === 'phone') {
            const regex = /^[0-9\b -]{0,13}$/; // 전화번호 형식 정규식

            // 입력이 정규식에 맞지 않으면 업데이트하지 않습니다.
            if (!regex.test(value)) return;
        }

        setUserData({ ...userData, [id]: value })
    }

    const [usePoints, setUsePoints] = useState(0);

    const handleUsePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value);
      
        if (isNaN(value)) { // 입력이 숫자가 아닐 경우
          value = 0; // 값을 0으로 설정
        } else if (value < 0) { // 입력이 0보다 작을 경우
          value = 0; // 값을 0으로 설정
        } else if (value > userData.point) { // 입력이 보유 포인트보다 클 경우
          value = userData.point; // 값을 보유 포인트로 설정
        }
      
        setUsePoints(value);
    }

    const handleUsePointsClick = async () => {
        if (userData.point < usePoints) {
          alert('보유 포인트보다 많은 포인트를 사용할 수 없습니다.');
          return;
        }
      
        // Data type check and conversion
        const price = Number(product.productPrice);
        const points = Number(usePoints);
      
        setFinalPrice(price - points); // Update final price
    }
    const openPopup = () => {
        window.open('/pay-popup', '_blank', 'menubar=no,toolbar=no,location=no, width=500, height=500');
      };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="w-full max-w-4xl">
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Card>
                            <CardHeader className="flex items-center gap-4">
                                <CardTitle>배송 정보</CardTitle>
                                <Button size="icon" variant="outline">
                                    <FileEditIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">수취인</Label>
                                        <Input id="name" placeholder="이름" value={userData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="userId">구매자 아이디</Label>
                                        <Input id="userId" placeholder="아이디" value={userData.userId} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone">전화번호</Label>
                                        <Input id="phone" placeholder="휴대폰 번호" value={userData.phone} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label htmlFor="address">주소</Label>
                                        <Input className="min-h-[100px]" id="address" placeholder="주소" value={userData.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex items-center gap-4">
                                <CardTitle>상품 정보</CardTitle>
                                <Button size="icon" variant="outline">
                                    <FileEditIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="space-y-1.5">
                                        <Label>상품 이름</Label>
                                        <div>{product.productName}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>수량</Label>
                                        <div>{product.productCount}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>금액</Label>
                                        <div>{product.productPrice}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="flex items-center gap-4">
                                <CardTitle>결제 정보</CardTitle>
                                <Button size="icon" variant="outline">
                                    <FileEditIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="number">카드 번호</Label>
                                        {userData.cardNum ? (
                                            <select id="number" onChange={handleInputChange}>
                                                {userData.cardNum.map((num, index) => (
                                                    <option key={index} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <select id="number" disabled>
                                                <option>카드번호</option>
                                            </select>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>보유 포인트</Label>
                                        <div>{userData.point}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>사용할 포인트</Label>
                                        <Input type="number" min="0" placeholder="사용 포인트" value={usePoints} onChange={handleUsePointsChange} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Button onClick={handleUsePointsClick}>포인트 사용</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
                <CardFooter>
                    <div>{finalPrice}</div>
                        <Button className="ml-auto" onClick={openPopup}>Pay</Button>
                </CardFooter>
            </Card>
        </div>
    )
}


function FileEditIcon(props: SVGProps<SVGSVGElement>) {
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
            <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
        </svg>
    )
}
