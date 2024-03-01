import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/QA_button";
import { Textarea } from "@/components/ui/QA_textarea";
import "@/app/globals.css";

interface QaModalProps {
  closeModal: () => void; // closeModal 함수 prop으로 전달
  //userId: string; // session.key로 변경
  productId: string; // productId prop 추가
}

const QaModal: React.FC<QaModalProps> = ({ closeModal, productId }) => {
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const sessionKey = typeof window !== 'undefined' ? sessionStorage.getItem('key') : null;
  const handleSubmit = async () => {
    try {
      // 내용이 입력되었는지 확인
      if (!question.trim()) {
        setErrorMessage('문의 내용을 입력해주세요.');
        return;
      }

      // 서버로 보낼 데이터 구성
      const dataToSend = {
        key: sessionKey,
        productId: productId,
        question: question // textarea에 입력된 내용
      };

      // 서버에 POST 요청 보내기
      const qaResponse= await axios.post('http://192.168.0.132:5000/api/qa-question-submit', dataToSend);
      const qaData = qaResponse.data;
      console.log(qaData);

      // 모달 닫기
      closeModal();

      // 요청이 성공적으로 처리되면 상태 초기화 또는 필요한 동작 수행
      setQuestion('');
      setErrorMessage('');

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 max-w-2xl w-full rounded-lg shadow-lg relative flex flex-col items-center">
        <Button className="absolute top-2 right-2" variant="ghost" onClick={closeModal}>
          X
          <span className="sr-only">Close</span>
        </Button>
        <div className="space-y-2 w-full">
          <h3 className="text-lg font-semibold">문의하기</h3>
          <div className="w-full h-64 overflow-auto">
            <Textarea className="w-full h-full" placeholder="문의 내용을 작성해주세요" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="mt-1 text-sm text-gray-500">* 개인정보(주민번호, 연락처, 주소, 계좌번호, 카드번호 등)가 포함되지 않도록 유의해주세요.</div>
        </div>
        <div className="my-2">
          <Button onClick={handleSubmit}>제출하기</Button>
        </div>
      </div>
    </div>
  );
};

export default QaModal;