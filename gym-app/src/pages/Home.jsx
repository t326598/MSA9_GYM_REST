import React, { useEffect, useState } from 'react';
import './Home.css'; // CSS 파일 임포트
import { Link } from 'react-router-dom';
import Header from '../components/header/header'; // Header 임포트
import Footer from '../components/Footer/footer';

const Home = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://192.168.30.63:8080/admin/attendance/userCount'); // 백엔드 API URL
        if (response.ok) {
          const data = await response.json(); // JSON 응답을 파싱
          setUserCount(data.userCount); // userCount를 상태로 저장
        } else {
          console.error('Failed to fetch user count');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserCount();

    // 주기적으로 사용자 수를 갱신 (예: 10초마다)
    const interval = setInterval(fetchUserCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const scrollFunction = () => {
    const topBtn = document.getElementById("topBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      // topBtn.style.display = "block";
    } else {
      // topBtn.style.display = "none";
    }
  };

  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    window.onscroll = scrollFunction;
    window.onload = () => window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Header 컴포넌트 추가 */}
      <Header />

      <div className='osw'> 
        <div>
          {/* ranking 페이지로 가는 링크 */}
          <Link to="/ranking">
            <button>랭킹 페이지로 이동</button>
          </Link>

          {/* 헬스장 입장 가는 링크 */}
          <Link to="/generate-qr-code">
            <button>헬스장 입장</button>
          </Link>

          {/* 출석내역 가는 링크 */}
          <Link to="/admin/attendanceList">
            <button>출석 내역</button>
          </Link>

          {/* 로그인 가는 링크 */}
          <Link to="/login">
            <button>로그인</button>
          </Link>

          <div className="osw" style={{ height: '100vh', width: '100%' }}>
            <img src="/images/메인.png" alt="메인 이미지" className="main-image zoom-animation" />
            <div className="icon">
              <img src="/images/icon.png" alt="로고" className="logo bounce-animation" style={{ zIndex: '-100000' }} />
            </div>
            <div className="userCount">실시간 헬스장 이용자 수</div>
            <div className="userCount2">
              <span>{userCount}명 /</span>
              <span className={userCount < 10 ? 'status-icon low' : userCount < 30 ? 'status-icon normal' : 'status-icon high'}>
                {userCount < 10 ? '여유' : userCount < 30 ? '보통' : '포화'}
              </span>
            </div>
            <div className="centerLogo">
              <img src="/images/logo.png" alt="로고" className="logo bounce-animation" />
            </div>
          </div>

          {/* 두 번째 섹션 */}
          <div className="container1" style={{ backgroundColor: 'black' }}>
            <img src="/images/메인2.png" alt="메인 이미지" className="main-image2" />
          </div>

          {/* 세 번째 섹션 */}
          <div className="container3">
            <h2 className="youtubeword" style={{ marginLeft: '0' }}>생생한 현장 분위기</h2>
            <div className="youtube-container">
              <iframe
                src="https://www.youtube.com/embed/iEfJq1WsyE4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="youtube"
                style={{width : '1300px', height: '800px'}}
                
              ></iframe>
            </div>
          </div>

          {/* 네 번째 섹션 */}
          <div className="container4">
            <div className="maptext">오시는 길</div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=..." // 실제 URL로 교체
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                className="map"
                style={{width : '1300px', height: '700px'}}
              ></iframe>
            </div>
          </div>
          <div className="location-info">
            <h2>핏넥서스 부평점</h2>
            <p>인천 부평구 경원대로 1366 7층 핏넥서스</p>
            <h2>오시는 길</h2>
            <li>부평구청역 5번출구에서 도보 5분 직진 후 안쪽 래미안 아파트 상가</li>
            <li>주차장이 있습니다. 차량으로 방문 시 미리 연락 부탁드립니다.</li>

            <h3>이용시간</h3>
            <p>
              평일: 06:00 - 24:00<br />
              토요일: 06:00 - 20:00<br />
              일요일: 06:00 - 20:00<br />
              <strong>※ 일요일 제외 국가 공휴일 모두 휴무</strong>
            </p>
          </div>

          {/* top 버튼 */}
          <button onClick={topFunction} id="topBtn" title="Go to top">
            ↑
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
