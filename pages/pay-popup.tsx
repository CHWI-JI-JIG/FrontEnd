import "@/app/globals.css"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { SVGProps } from "react"
import { Key } from "lucide-react";
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/apiConfig';

export default function payPopup() {

  const [password, setPassword] = useState(Array(6).fill(null));
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleNumButtonClick = (num: number) => {
    const nextPassword = [...password];
    const firstEmptyIndex = nextPassword.indexOf(null);

    if (firstEmptyIndex !== -1) {
      nextPassword[firstEmptyIndex] = num;
      setPassword(nextPassword);

    }
  };

  const handleDeleteButtonClick = () => {
    const nextPassword = [...password];
    let lastNotEmptyIndex = -1;

    for (let i = nextPassword.length - 1; i >= 0; i--) {
      if (nextPassword[i] !== null) {
        lastNotEmptyIndex = i;
        break;
      }
    }

    if (lastNotEmptyIndex !== -1) {
      nextPassword[lastNotEmptyIndex] = null;
      setPassword(nextPassword);
    }
  };
  const initPass = '123456'

  type PaymentStatus = {
    success: boolean;
    errorType: 'nomoney' | 'timeout' | 'other' | 'paymentError' | 'networkError' | 'noCookie' | 'passwordMismatch' | null;
  };

  const handleOKButtonClick = async () => {
    const enterPass = password.join('');
    const Pass = enterPass === initPass;
    var buyinfo = true
    let paymentStatus: PaymentStatus = { success: true, errorType: null };


    const sendPaymentInfo = async (transId: string, price: number, cardNum: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/PG/sendpayinfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: transId,
            cardNum: cardNum,
            productPrice: price,
            paymentVerification: true
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          if(responseData.success === false){
            if(responseData.nomoney){
              alert(responseData.message);
              paymentStatus.errorType = 'nomoney';
              buyinfo = false;
            }
            else if(responseData.timeout){
              alert(responseData.message)
              sessionStorage.clear();
              paymentStatus.errorType = 'timeout';
              buyinfo = false;
            }
            else{
              alert(responseData.message);
              paymentStatus.errorType = 'other';
              buyinfo = false;
            }
          }
          return responseData.success;  // 이 부분을 수정했습니다.
        } else {
          alert("결제 오류가 발생했습니다.")
          paymentStatus = { success: false, errorType: 'paymentError' };
          buyinfo = false;
          return false;
        }
      } catch (error) {
        alert("잠시후 다시 시도해주시기 바랍니다.");
        buyinfo = false;
        return false;
      }
    };

    const paymentInfo = Cookies.get('paymentInfo');

    if (Pass) {
      if (paymentInfo) {
        const { cardNum, price, transId } = JSON.parse(paymentInfo);
        const success = await sendPaymentInfo(transId, price, cardNum);  // success 받기
        if (!buyinfo) { // buyinfo가 false면 실패로 간주
          window.opener.postMessage({ success: false ,errorType: paymentStatus.errorType}, '*');
        } else {
          window.opener.postMessage({ success }, '*');  // success 메시지 전달
        }
      } else {
        console.log('undefined cookie');
        window.opener.postMessage({ success: false }, '*');
      }
  
      // buyinfo가 true일 때만 창을 닫음
      if (buyinfo) {
        window.opener.postMessage({ success: true }, '*');
      }
    } else {
      window.opener.postMessage({ success: false }, '*');
    }        
    window.close();

  };

  useEffect(() => {
    // 비밀번호 6자리가 모두 입력되었는지 확인하여 버튼 활성화 여부 결정
    setIsButtonEnabled(password.every(digit => digit !== null));
  }, [password]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FlagIcon className="text-[#121513] h-6 w-6" />
            <span className="font-bold">Pay</span>
          </div>
          <PanelTopCloseIcon className="text-gray-400 h-6 w-6" />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 w-24 h-2 bg-[#121513] rounded-full" />
          <h2 className="text-lg font-semibold mb-2">비밀번호 입력</h2>
          <div className="flex items-center justify-center mb-4">
            {password.map((digit, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full mx-1 ${digit !== null ? 'bg-[#121513]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gray-200 p-4 grid grid-cols-3 gap-4 rounded-lg">
          {/* 숫자 버튼들 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumButtonClick(num)}
              className={`text-white text-2xl font-semibold border border-solid border-gray-300 ${isButtonEnabled ? 'hover:bg-gray-700' : ''
                }`}>
              {num}
            </button>
          ))}
          <button
            onClick={handleOKButtonClick}
            className={`text-white text-xl font-semibold border border-solid border-gray-300 ${isButtonEnabled ? 'bg-black' : 'bg-gray-200'} ${isButtonEnabled ? 'hover:bg-gray-700' : ''}`}
            disabled={!isButtonEnabled}>
            확인
          </button>
          <button onClick={() => handleNumButtonClick(0)} className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            0
          </button>
          <button onClick={handleDeleteButtonClick} className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            <DeleteIcon className="h-6 w-6" />
          </button>
        </div>

      </div>
    </div>
  )
}


function FlagIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}


function PanelTopCloseIcon(props: SVGProps<SVGSVGElement>) {
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
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 16 3-3 3 3" />
    </svg>
  )
}

function DeleteIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  )
}