import { useEffect, useState } from 'react';

export default function ErrorTest() {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('/api/err-test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server responded with an error!');
        }
        return response.json();
      })
      .catch((error) => {
        setErrorMessage(error.toString());
      });
  }, []);

  return (
    <div>
      {errorMessage ? (
        <p>에러 메시지: {errorMessage}</p>
      ) : (
        <p>에러 테스트 페이지입니다. Flask 서버로부터 응답을 기다리는 중...</p>
      )}
    </div>
  );
}
