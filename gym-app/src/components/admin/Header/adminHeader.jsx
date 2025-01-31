import React, { useContext, useEffect } from 'react';
import './adminHeader.css';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import * as Swal from '../../../apis/alert'
import { useNavigate } from 'react-router-dom';

const Header = () => {


  // const { isLogin, userInfo, roles, isLoading } = useContext(LoginContext)
  // const navigate = useNavigate();
  const handleLogout = async () => {
    // 로그아웃 요청을 보낼 때 CSRF 토큰을 헤더에 포함시켜 보냅니다.
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // 필요한 경우 body에 데이터 추가
      });
      // 로그아웃 후 처리
      window.location.href = '/'; // 또는 원하는 리디렉션
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

    // useEffect(() => {
    //   if (isLoading) {
    //     return;
    //   }
  
    //   if (!isLogin) {
    //     Swal.alert('로그인을 시도해주세요', '로그인 화면으로 이동합니다', 'warning', () => {
    //       navigate('/login');
    //     });
    //     return;
    //   }
  
    //   if (!userInfo) {
    //     Swal.alert('잘못된 접근입니다.', '메인 화면으로 이동합니다.', 'warning', () => {
    //       navigate('/');
    //     });
    //     return;
    //   }
  
    //   console.log("권한 : " + roles.isUser);
  
    //   if (roles.isUser) {
    //     Swal.alert('권한이 없습니다.', '메인 화면으로 이동합니다.', 'warning', () => {
    //       navigate('/');
    //     });
    //     return;
    //   }
  
    // }, [isLoading, isLogin, userInfo, roles, navigate]);
  
    // if (isLoading || !isLogin || !userInfo || roles.isUser) {
    //   return null;
    // }
  

  return (
    <div className='header'>
      <header>
        <div className="logo">
          <a href="/"><img src="/images/logo.png" alt="로고" /></a>
        </div>
        <div className="header-link">
          <a href="/">메인화면</a>
          <button
            type="button"
            onClick={handleLogout}
            style={{ textDecoration: 'none', color: 'inherit', border: 'none', background: 'none',
                  fontSize: '18px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', fontWeight: 'bold', cursor: 'pointer'
             }}>
            로그아웃
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
