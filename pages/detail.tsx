import { useState, useEffect, useContext, SVGProps } from 'react';
import { useRouter } from 'next/router';
import { Input } from "@/components/ui/MA_input"
import { Label } from "@/components/ui/DE_label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/DE_select";
import axios from 'axios';
import { Button } from "@/components/ui/DE_button";
import "@/app/globals.css";
import QaModal from './qa-modal'; // qa-modal 컴포넌트
import Link from "next/link"
import { getSessionData, handleLogout } from '@/utils/auth'
import { API_BASE_URL } from '@/config/apiConfig';
import Cookies from 'js-cookie'
import { SearchIcon } from 'lucide-react';
import { handleSearch, searchProduct } from '@/utils/search';
import { handleNextPage, handlePrevPage, numberWithCommas } from '@/utils/commonUtils';

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

export default function Detail() {
  //detail 페이지 접근통제(취약점 생성!!!)
  useEffect(() => {
    if (auth === 'ADMIN') {
      // 세션이 인증되지 않았거나 판매자가 아닌 경우 알림 표시 후 서버에서 메인 페이지로 리디렉션
      alert('접근 권한이 없습니다.');
      router.push('/admin').then(() => {
        // 새로고침을 방지하려면 페이지 리디렉션이 완료된 후에 새로고침
        window.location.href = '/admin';
      });
    }
  }, []);

  const [product, setProduct] = useState<Product | null>(null);
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductCount, setSelectedProductCount] = useState<string>("1");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 추가 
  const [pageStatus, setPageStatus] = useState<string>("nologin"); // 페이지 상태 추가
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태 추가
  const [totalPage, setTotalPage] = useState<number>(1); // 총 페이지 상태 추가
  const router = useRouter();
  const { productId } = router.query;

  // 세션 데이터 가져오기
  const { auth, certification, key, name } = getSessionData();

  //검색창 테스트
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<searchProduct[]>([]);
  const onSearch = async () => {
    await handleSearch(keyword, setKeyword, setSearchResults, router);
  };

  const handleLogoutClick = async () => {
    handleLogout(router);
  
    try {
      // 세션 종료 요청
      await axios.post(`${API_BASE_URL}/api/logout`, {
        "key" : key
      });
  
      // 로그아웃 후 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    // 로그인 확인
    const checkLogin = async () => {
      if (sessionStorage.getItem('key') === null) {
        setPageStatus('nologinPage');
      }
      if (key) {
        try {
          if (auth === 'BUYER') {
            setPageStatus('buyerPage');
          } else {
            setPageStatus('sellerPage');
          }
        } catch (error) {
        }
      }
    };

    // 상품 정보 로드
    const fetchProductData = async () => {
      if (!productId) {
        return;
      }
      setLoading(true);
      try {
        const productResponse = await fetch(`${API_BASE_URL}/api/detail?productId=${productId}`);
        const productData = await productResponse.json();
        const product = productData;
        if (product) {
          setProduct(product);
        } else {
          return <div>로딩 중...</div>;
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    // 상품 아이디와 로그인 사용자 ID 확인
    // const checkProductOwnership = async () => {
    //     if (!productId) {
    //         console.log("잘못된 접근...");
    //         return;
    //     }

    //     if (key !== null) {
    //         try {
    //             const response = await axios.post(`${API_BASE_URL}/api/owner-check`, {
    //                 productId: productId,
    //                 session: { key: key }
    //             });
    //             const { owner } = response.data;
    //             // owner 값에 따라 로직을 처리합니다.
    //             if (owner) {
    //                 // 로그인한 사용자가 등록한 상품인 경우
    //                 console.log("로그인한 사용자가 등록한 상품입니다.");
    //             } else {
    //                 // 로그인한 사용자가 등록한 상품이 아닌 경우
    //                 console.log("로그인한 사용자가 등록한 상품이 아닙니다.");
    //             }
    //         } catch (error) {
    //             console.error('Error checking product ownership:', error);
    //         }
    //     }
    // };


    // Q&A 로드
    const fetchQAs = async (page: number) => {
      if (!productId) {
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/api/qa`, {
          productId: productId,
          page: page
        });
        const qa: PagedQAList = response.data;
        setQas(qa.data);
        setCurrentPage(page);
        setTotalPage(qa.totalPage); // 총 페이지 설정
      } catch (error) {
        alert("잠시후 다시 시도해주시기 바립니다.");
      }
    };

    checkLogin();
    fetchProductData();
    fetchQAs(currentPage); // 초기 페이지 데이터 가져오기
  }, [productId, key, currentPage]);

  const handlePageChange = async (page: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/qa`, {
        productId: productId,
        page: page // 페이지 번호 추가
      });
      const qa: PagedQAList = response.data;
      setQas(qa.data);
      setTotalPage(qa.totalPage); // 총 페이지 설정
      setCurrentPage(page); // 현재 페이지 설정
    } catch (error) {
      alert("잠시후 다시 시도해주세요.");
    }
  };

  const handleSelectChange = (selectedValue: string) => {
    setSelectedProductCount(selectedValue);
  };

  const handlePurchase = async () => {
    try {
      if (pageStatus === 'nologinPage') {
        // 로그인 페이지로 로드
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
      };

      Cookies.set('purchaseData', JSON.stringify(purchaseData), { expires: 1 });


      //const purchaseResponse = await axios.post(`${API_BASE_URL}/api/temppayment`, key);
      //console.log("구매 요청:", purchaseResponse.data);
    } catch (error) {
    }
  };

  const handleAnswer = async (qId: string) => {
    // input 창에서 작성된 답변 가져오기
    const answerInput = document.getElementById(`answerInput_${qId}`) as HTMLInputElement;
    const answer = answerInput.value;

    // 답변이 비어 있는지 확인
    if (answer.trim() === '') {
      alert('답변을 작성해주세요.');
      return;
    }

    try {
      // 답변 작성 API 호출
      const response = await axios.post(`${API_BASE_URL}/api/answer`, {
        qId: qId,
        answer: answer,
        key: key
      });
      // 답변 작성이 성공했을 때의 로직 처리
      if (response.data.success) {
        alert("글작성이 성공했습니다.")
      }
      else {
        alert(response.data.message)
      }
      // 성공적으로 답변을 작성했으므로, 화면을 다시 로드합니다.
      window.location.reload(); // 화면 새로고침

    } catch (error) {
      alert("잠시후 다시 시도해주시기 바립니다.")
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
    <>
      <header className="flex items-center justify-between py-8 px-6 text-white bg-[#121513]">
        <img src="/cjj.png" alt="취지직 로고"
          className="w-auto h-12" onClick={() => {
            if (auth === 'SELLER') {
              router.push('/seller');
            } else if (auth === 'BUYER') {
              router.push('/main');
            } else {
              router.push('/');
            }
          }} />

        {/* 검색창 테스트 */}
        <div className="flex items-center space-x-2">
          <Input className="w-96 border rounded-md text-black" placeholder="검색어를 입력해주세요"
            value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Button type="submit" className="text-gray-700 bg-[#F1F5F9]" variant="ghost" onClick={onSearch}>
            <SearchIcon className="text-gray-700" />
          </Button>
        </div>

        <div className="flex space-x-4">
          {certification ? (
            <>
              <Link href={auth === 'BUYER' ? '/mypage' : auth === 'SELLER' ? '/seller' : '/admin'}>
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">{name}님</Button>
              </Link>
              <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost" onClick={handleLogoutClick}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">로그인</Button>
              </Link>
              <Link href="/privacy-policy">
                <Button className="text-black bg-[#F1F5F9] hover:bg-[#D1D5D9]" variant="ghost">회원가입</Button>
              </Link>
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
              src={`${API_BASE_URL}${product.productImageUrl}`}
              width={200}
            />
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <h1 className="font-bold text-2xl sm:text-3xl">{product.productName}</h1>
            <div className="text-4xl font-bold">{numberWithCommas(product.productPrice)}원</div> {/* 가격 포맷 */}
            <p>{product.productDescription}</p>
            <div className="grid gap-4 md:gap-8">
              <form className="grid gap-4 md:gap-8">
                {pageStatus !== 'sellerPage' && (
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
                )}

                {pageStatus !== 'sellerPage' && (
                  sessionStorage.getItem('key') ? (
                    <Link href="/payment-page">
                      <Button size="lg" onClick={handlePurchase} style={{ width: '100%', display: 'block' }}>
                        구매하기
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button size="lg" style={{ width: '100%', display: 'block' }}>
                        구매하기
                      </Button>
                    </Link>
                  )
                )}
              </form>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-4xl mb-2">Q&A</h2>
          {pageStatus === 'buyerPage' && (
            <>
              <Button onClick={openModal}>Q&A 작성</Button>
              {isModalOpen && <QaModal closeModal={closeModal} productId={productId as string} />}
            </>
          )}

          {pageStatus === 'nologinPage' && (
            <Link href="/login">
              <Button>Q&A 작성</Button>
            </Link>
          )}
        </div>

        <div>
          {qas.map((qa, index) => (
            <div key={qa.qId} className="text-sm" style={{ margin: '10px 0' }}>
              <div className="border-b border-gray-300 pb-4">
                <h3 className="font-medium text-lg mb-2">Q. {qa.question}</h3>
                {pageStatus === 'sellerPage' && qa.answer === null && (
                  <div className="flex space-x-4 items-center">
                    <input
                      type="text"
                      id={`answerInput_${qa.qId}`}
                      placeholder="답변을 작성해주세요"
                      className="border p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleAnswer(qa.qId)}
                      className="text-white bg-[#121513] py-2 px-4 rounded"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      답변
                    </button>
                  </div>
                )}
                {qa.answer !== null && (
                  <p className="font-medium text-lg text-gray-500 mt-2">A. {qa.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
        {isModalOpen && <QaModal closeModal={closeModal} productId={productId as string} />}
      </div>
    </>
  );
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