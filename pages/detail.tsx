import { useState, useEffect, useContext, SVGProps } from 'react';
import { useRouter } from 'next/router';
import { Input } from "@/components/ui/MA_input"
import { Label } from "@/components/ui/DE_label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/DE_select";
import axios from 'axios';
import { Button } from "@/components/ui/DE_button";
import "@/app/globals.css";
import QaModal from './qa-modal'; // qa-modal 컴포넌트를 불러옵니다.
import Link from "next/link"
import { getSessionData } from '@/utils/auth'

interface Product {
    productId: string;
    productName: string;
    productPrice: number;
    productImageUrl: string;
    productDescription: string;
}

interface PagedQAList {
    page: number;
    size: number;
    totalPage: number;
    totalCount: number;
    data: QA[]
}

interface QA {
    qId: string;
    question: string;
    answer: string;
}

// 가격 포맷 함수
const numberWithCommas = (number: number) => {
    return number.toLocaleString();
};

export default function Detail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [qas, setQas] = useState<QA[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProductCount, setSelectedProductCount] = useState<string>("1");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 추가 
    const [pageStatus, setPageStatus] = useState<string>("buyerPage"); // 페이지 상태 추가
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태 추가
    const [totalPage, setTotalPage] = useState<number>(1); // 총 페이지 상태 추가
    const router = useRouter();
    const { productId } = router.query;

    // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();
  
  const handleLogout = () => {
    // sessionStorage 초기화
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
  };

    useEffect(() => {
        // 로그인 확인을 위한 API 호출
        const checkLogin = async () => {
            if (key) {
                try {
                    if (!certification) {
                        setPageStatus('nologinPage');
                    }
                    if (auth === 'seller') {
                        setPageStatus('sellerPage');
                    } else {
                        setPageStatus('buyerPage');
                    }
                } catch (error) {
                    console.error('Error fetching session:', error);
                }
            }
        };

        // 상품 정보 로드
        const fetchProductData = async () => {
            if (!productId) {
                console.log("잘못된 접근...");
                return;
            }
            setLoading(true);
            try {
                const productResponse = await fetch(`http://192.168.0.132:9988/api/detail?productId=${productId}`);
                const productData = await productResponse.json();
                const product = productData;
                if (product) {
                    setProduct(product);
                } else {
                    return <div>로딩 중...</div>;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        // 상품 아이디와 로그인 사용자 ID 확인
        const checkProductOwnership = async () => {
            if (!productId) {
                console.log("잘못된 접근...");
                return;
            }

            if (key !== null) {
                try {
                    const response = await axios.post('/api/owner-check', {
                        productId: productId,
                        session: { key: key }
                    });
                    const { owner } = response.data;
                    // owner 값에 따라 로직을 처리합니다.
                    if (owner) {
                        // 로그인한 사용자가 등록한 상품인 경우
                        console.log("로그인한 사용자가 등록한 상품입니다.");
                    } else {
                        // 로그인한 사용자가 등록한 상품이 아닌 경우
                        console.log("로그인한 사용자가 등록한 상품이 아닙니다.");
                    }
                } catch (error) {
                    console.error('Error checking product ownership:', error);
                }
            }
        };


        // Q&A 로드
        const fetchQAs = async (page: number) => {
            if (!productId) {
                console.log("잘못된 접근...");
                return;
            }
            try {
                const response = await axios.post('/api/qa', {
                    productId: productId,
                    page: page, // 페이지 번호 전달
                    session: { key: key }
                });
                const qa: PagedQAList = response.data;
                setQas(qa.data);
                setTotalPage(qa.totalPage); // 총 페이지 설정
            } catch (error) {
                console.error('Error fetching Q&A:', error);
            }
        };


        checkLogin();
        fetchProductData();
        checkProductOwnership();
        fetchQAs(currentPage); // 초기 페이지 데이터 가져오기
    }, [productId, key, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // 페이지 변경 핸들러
    };

    const handleSelectChange = (selectedValue: string) => {
        setSelectedProductCount(selectedValue);
    };

    const handlePurchase = async () => {
        try {
            if (pageStatus === 'nologinPage') {//로그인 페이지로 로드
                router.push('/login');
            }
            if (!product) {
                return;
            }
            const purchaseData = {
                productId: product.productId,
                productName: product.productName,
                productCount: parseInt(selectedProductCount),
                productPrice: product.productPrice,
                key: key
            };
            const purchaseResponse = await axios.post('http://192.168.0.132:9988/api/temppayment', purchaseData);
            console.log("구매 요청:", purchaseResponse.data);
        } catch (error) {
            console.error('Error handling purchase:', error);
        }
    };
    const handleAnswer = async (qId: string) => {
        // input 창에서 작성된 답변 가져오기
        const answerInput = document.getElementById(`answerInput_${qId}`) as HTMLInputElement;
        const answer = answerInput.value;

        // 답변 작성 API 호출
        try {
            const response = await axios.post('/api/answer', {
                qId: qId,
                answer: answer
            });
            // 답변 작성이 성공했을 때의 로직 처리
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    };

    // 모달 열기 함수
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="max-w-screen-xl mx-auto">
            <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
              <a className="text-3xl font-bold" onClick={() => {window.location.reload();}}>취지직</a>
              <div className="flex space-x-4">
                {certification ? (
                  <>
                    <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                      <Link href="/mypage">{name}님</Link>
                    </Button>
                    <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                      <Link href="/login">로그인</Link>
                    </Button>
                    <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">
                      <Link href="/privacy-policy">회원가입</Link>
                    </Button>
                  </>
                )}
              </div>
            </header>

            <div className="my-6 mx-6">
                <div className="grid md:grid-cols-2 md:gap-6 items-start">
                    <div>
                        <img
                            alt="Product Image"
                            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                            height={200}
                            src={product.productImageUrl}
                            width={200}
                        />
                    </div>
                    <div className="flex flex-col gap-4 md:gap-8">
                        <h1 className="font-bold text-2xl sm:text-3xl">{product.productName}</h1>
                        <div className="text-4xl font-bold">{numberWithCommas(product.productPrice)}</div> {/* 가격 포맷 */}
                        <p>{product.productDescription}</p>
                        <div className="grid gap-4 md:gap-8">
                            <form className="grid gap-4 md:gap-8">
                                <div className="grid gap-2">
                                    <Label className="text-base" htmlFor="quantity">
                                        수량
                                    </Label>
                                    <select defaultValue="1" onChange={(e) => handleSelectChange(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>

                                {/* 버튼을 사용자 권한에 따라 조건부 렌더링 */}
                                {pageStatus !== 'sellerPage' && (
                                    <Button size="lg" onClick={handlePurchase}>구매하기</Button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-gray-300 dark:border-gray-600" /> {/* 구분선 */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-bold text-4xl mb-2">Q&A</h2>
                    {pageStatus === 'sellerPage' ? (
                        <Button onClick={openModal}>Q&A 작성</Button>
                    ) : null}
                </div>

                <div>
                    {qas.map((qa, index) => (
                        <div key={qa.qId} className="text-sm" style={{ margin: '10px 0' }}>
                            <div className="border-b border-gray-300 pb-4">
                                <h3 className="font-medium text-lg">Q. {qa.question}</h3>
                                {qa.answer !== "" ? (
                                    <p className="text-gray-500">A. {qa.answer}</p>
                                ) : (
                                    <>
                                        <input type="text" placeholder="답변을 작성해주세요" />
                                        <button onClick={() => handleAnswer(qa.qId)}>답변</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>


                <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
                {isModalOpen && <QaModal closeModal={closeModal} productId={productId as string} />}
            </div>
        </div>
    );

    function SearchIcon(props: SVGProps<SVGSVGElement>) {
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        );
    }
}

// 페이징 컴포넌트
interface PaginationProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPage, onPageChange }) => {
    const pages = [];

    for (let i = 1; i <= totalPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-3 py-1 rounded-lg focus:outline-none ${currentPage === i ? 'bg-gray-300' : ''}`}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="flex justify-center mt-4">
            {pages}
        </div>
    );
};
