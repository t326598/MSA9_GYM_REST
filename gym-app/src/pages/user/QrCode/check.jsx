// src/components/Check.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as checkAttendance from '../../../apis/check';
import './Check.css';
import Swal from 'sweetalert2';

const Check = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const uuid = params.get('uuid');
  const userNo = params.get('qrcodeId');

  // JWT 토큰 가져오기 (로컬 스토리지에서 가져오는 예시)
  const token = localStorage.getItem('jwt');

  // 출석 체크 요청을 서버로 보내는 함수
  const handleAttendanceCheck = async () => {
    try {

      const response = await checkAttendance.check(uuid, userNo);

      const status = response.status

      if (status == 200) {
        Swal.fire({
          icon: 'success',
          title: response.message || "출석 체크 완료",
          confirmButtonText: '확인',
        }).then(() => {
          // 알림 확인 버튼을 누른 후 페이지 이동
          navigate('/');

        });
      }
    } catch (error) {
      console.error('출석 체크 오류:', error);
      alert('출석 체크 중 오류가 발생했습니다.');
    }
  };

  // 메인 페이지로 이동하는 함수
  const goToMain = () => {
    navigate('/');
  };

  return (
    <div className="oswCheck" style={{backgroundColor : "white"}}>
      <div className="container">
        <h1 className="header" style={{color : 'black'}}>출석 체크</h1>
        <button onClick={handleAttendanceCheck} className="btn">출석 확인</button>
        <button onClick={goToMain} className="btn btn-secondary">메인으로</button>
      </div>
    </div>
  );
};

export default Check;