import "@/app/globals.css"
import React, {useState} from "react"
import axios from "axios"
import { SVGProps } from "react"

export default function payPopup() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FlagIcon className="text-[#1ec800] h-6 w-6" />
            <span className="font-bold">Pay</span>
          </div>
          <PanelTopCloseIcon className="text-gray-400 h-6 w-6" />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 w-24 h-2 bg-[#1ec800] rounded-full" />
          <h2 className="text-lg font-semibold mb-2">비밀번호 입력</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mx-1" />
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mx-1" />
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mx-1" />
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mx-1" />
          </div>
          <a className="text-sm text-[#1ec800]" href="#">
            {`비밀번호 재설정 >`}
          </a>
        </div>
        <div className="mt-6 bg-gray-200 p-4 grid grid-cols-3 gap-4 rounded-lg">
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            1
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            2
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            3
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            4
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            5
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            6
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            7
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            8
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            9
          </button>
          <div className="flex items-center justify-center">
            <FingerprintIcon className="text-white h-6 w-6" />
            <span className="sr-only">Fingerprint authentication</span>
          </div>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
            0
          </button>
          <button className="text-white text-2xl font-semibold border border-solid border-gray-300 hover:bg-gray-700">
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


function FingerprintIcon(props:SVGProps<SVGSVGElement>) {
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
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
      <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
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
