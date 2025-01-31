import React, { useEffect, useState, useContext } from 'react';
import QRCode from 'qrcode';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 
import './QrCode.css';

const QrCode = () => {
  const { isLogin, userInfo } = useContext(LoginContext);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [expired, setExpired] = useState(false);
  const [ticketBuyList, setTicketBuyList] = useState([]); // 티켓 구매 리스트 상태 추가
  const [startedTicket, setStartedTicket] = useState(null); // 정상 상태인 가장 오래된 티켓 상태 추가
  const navigate = useNavigate(); // navigate 훅 사용

  // 사용자 번호를 userInfo에서 가져오기
  const userNo = userInfo?.no;

  // 페이지 진입 시 티켓 보유 여부 확인
  useEffect(() => {
    console.log("전체 userInfo 구조:", userInfo); // userInfo 전체 구조 확인
    console.log("ticket 값:", userInfo?.ticket); // ticket이 존재하는지 확인

    if (!isLogin || !userInfo) {
      // 로그인되지 않았거나 userInfo가 없으면 티켓 구매 화면으로 리다이렉트
      navigate('/ticket/ChoiceTicket'); // 티켓 구매 화면 경로로 이동
      return;
    }

    // 티켓 구매 내역을 API 호출로 가져오기
    if (userNo) {
      fetch(`http://localhost:8080/buyList/users/${userNo}`)
        .then(response => response.json())
        .then(data => {
          console.log('구매 리스트 데이터:', data);

          setTicketBuyList(data.ticketBuyList || []); // 기본값 빈 배열로 처리

          // 정상 상태인 가장 오래된 티켓 필터링
          const startedTicket = data.ticketBuyList?.length > 0 ?
            data.ticketBuyList.filter(b => b.status === '정상')
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] : null;

          setStartedTicket(startedTicket); // 가장 오래된 정상 티켓 저장

          if (!startedTicket) {
            // 이용권 내역이 없으면 알림 후 이용권 구매 페이지로 이동
            Swal.fire({
              icon: 'error',
              title: '이용권을 구매해주세요',
              text: '헬스장 입장 시 이용권이 필요합니다.',
            }).then(() => {
              navigate('/ticket/ChoiceTicket'); 
            });
          } else {
            // 정상 상태인 티켓이 있으면 QR 코드 생성
            generateQRCode();
          }
        })
        .catch(error => console.error('API 호출 중 오류 발생:', error));
    }
  }, [isLogin, userNo, userInfo, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      setExpired(true);
      deleteQRCode();
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    // 정상 상태인 티켓이 있을 때 QR 코드 생성
    if (startedTicket) {
      generateQRCode();
    }
  }, [startedTicket]);

  const generateQRCode = async () => {
    try {
      const uuid = generateUUID();
      const url = `/user/attendance/check?qrcodeId=${userInfo.no}&uuid=${uuid}`;
      const qrCodeImage = await QRCode.toDataURL(url);
      setQrCodeUrl(url);
      setQrCodeBase64(qrCodeImage);
    } catch (err) {
      console.error('QR 코드 생성 실패:', err);
    }
  };

  const deleteQRCode = async () => {
    console.log('QR 코드 만료 처리');
  };

  return (
    <div className="oswQrCode">
      <div className="qr-container">
        <div className="qr-code" id="qrCodeContainer">
          <img src={qrCodeBase64} alt="QR 코드" />
        </div>
        <div className="timer">
          유효시간: <span id="countdown">{expired ? '만료되었습니다.' : countdown}</span>
          {!expired && <span id="unit">초</span>}
        </div>
        {!expired && (
          <div className="url-text" id="URLTEXT2">
            QR 코드 URL:{' '}
            <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" id="URLTEXT">
              {qrCodeUrl}
            </a>
          </div>
        )}
        <button className="main-button" id="mainButton" onClick={() => (window.location.href = '/')}>
          메인으로
        </button>
      </div>
    </div>
  );
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default QrCode;
