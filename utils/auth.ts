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
        name: sessionStorage.getItem('name'),
      };
      return sessionData;
    } else {
      return { auth: null, certification: null, key: null, name: null };
    }
  };
  