import { API_BASE_URL } from '@/config/apiConfig';
import axios from "axios"

export const setSessionData = (data: { auth: string; certification: string; key: string; name: string }) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('auth', data.auth);
    sessionStorage.setItem('certification', data.certification);
    sessionStorage.setItem('key', data.key);
    sessionStorage.setItem('name', data.name);
  }
};

export const getSessionData = () => {
  if (typeof sessionStorage !== 'undefined') {
    const sessionData = {
      auth: sessionStorage.getItem('auth'),
      certification: sessionStorage.getItem('certification'),
      key: sessionStorage.getItem('key'),
      name: sessionStorage.getItem('name')
    };
    return sessionData;
  } else {
    return { auth: null, certification: null, key: null, name: null };
  }
};

import { NextRouter } from 'next/router';
export const handleLogout = async (router: NextRouter) => {
  // sessionStorage 초기화
  if (typeof sessionStorage !== 'undefined') {
    const key = sessionStorage.getItem('key');
    
    sessionStorage.clear();
    try {
      // 세션 종료 요청
      await axios.post(`${API_BASE_URL}/api/logout`, {
        "key" : key
      });
  
      // 로그아웃 후 로그인 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }
};