import "@/app/globals.css"
import React, {useEffect, useState} from "react"
import axios from "axios"
import { SVGProps } from "react"
import { Key } from "lucide-react";

export default function payPopup() {

  const [password, setPassword] = useState(Array(6).fill(null));
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleNumButtonClick = (num: number) => {
    const nextPassword = [...password];
    const firstEmptyIndex = nextPassword.indexOf(null);

    console.log('Num Button Clicked:', num); // 확인을 위한 로그
    
    if (firstEmptyIndex !== -1) {
      nextPassword[firstEmptyIndex] = num;
      setPassword(nextPassword);

      console.log('Password Updated:', nextPassword); // 확인을 위한 로그
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

  const handleOKButtonClick = () => {
    console.log('클릭했쏘요~',password);
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
              className={`text-white text-2xl font-semibold border border-solid border-gray-300 ${
                isButtonEnabled ? 'hover:bg-gray-700' : ''
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


function PanelTopCloseIcon(props:SVGProps<SVGSVGElement>) {
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

function DeleteIcon(props:SVGProps<SVGSVGElement>) {
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