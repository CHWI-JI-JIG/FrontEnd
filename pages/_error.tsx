
import Link from "next/link"
import { SVGProps } from "react"
import "@/app/globals.css";

export default function _ERR() {
  return (
    <div className="w-full min-h-screen gap-0">
      <header className="flex items-center w-full px-4 py-2 border-b md:px-6">
        <Link className="flex items-center gap-2 text-lg font-semibold" href="/main">
          <HomeIcon className="h-6 w-6" />
          <span className="sr-only">메인으로 돌아가기</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 text-center md:px-6">
        <div className="flex flex-col gap-2">
          <FileWarningIcon className="h-16 w-16" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">에러!</h1>
            <p className="text-gray-500">예상하지 못한 에러가 발생했습니다.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
          <Link
            className="inline-flex h-10 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            href="/main"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  )
}


function HomeIcon(props: SVGProps <SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function FileWarningIcon(prop: SVGProps <SVGSVGElement>) {
  return (
    <svg
      {...prop}
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
