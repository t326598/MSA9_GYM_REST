import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../../../apis/auth';
import * as Swal from '../../../apis/alert';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import './UserInfo.css';
import Header from '../../../components/header/header';
import Footer from '../../../components/Footer/footer';

const TicketBuyList = () => {
  const { isLoading, isLogin, roles, logout, userInfo } = useContext(LoginContext);
  const navigate = useNavigate();

  const [userNo, setUserNo] = useState(null);
  const [ticketBuyList, setTicketBuyList] = useState([]); // 빈 배열로 초기화
  const [startedTicket, setStartedTicket] = useState(null);

  // userNo 상태 추가
  useEffect(() => {
    console.log('userInfo:', userInfo);
    if (userInfo && userInfo.no) {
      setUserNo(userInfo.no);
      console.log('userNo:', userInfo.no);
    } else {
      console.log('userInfo가 없거나 userNo가 없습니다.');
    }
  }, [userInfo]);

  useEffect(() => {
    if (userNo) {
      // API 호출하여 구매 내역 데이터 가져오기
      fetch(`http://192.168.30.63:8080/buyList/users/${userNo}`)
        .then(response => response.json())
        .then(data => {
          console.log('구매 리스트 데이터:', data);

          // 데이터에서 티켓 구매 내역과 가장 오래된 티켓 가져오기
          setTicketBuyList(data.ticketBuyList || []); // 기본값 빈 배열로 처리

          // 구매 내역이 있을 때만 정상 상태인 티켓 필터링
          const startedTicket = data.ticketBuyList?.length > 0 ? 
            data.ticketBuyList.filter(b => b.status === '정상')
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] : null;

          setStartedTicket(startedTicket);
        })
        .catch(error => console.error('API 호출 중 오류 발생:', error));
    }
  }, [userNo]);

  const updateUser = async (form) => {
    try {
      const response = await auth.update(form);
      if (response.status === 200) {
        Swal.confirm('회원정보 수정 성공', '로그아웃 후 다시 로그인 해주세요.', 'success', () => logout(true));
      } else {
        Swal.confirm('회원정보 수정 실패', '회원정보 수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('회원정보 수정 중 에러가 발생하였습니다.');
    }
  };

  const removeUser = async (no) => {
    try {
      const response = await auth.remove(no);
      if (response.status === 200) {
        Swal.alert('회원탈퇴 성공', '그동안 감사했습니다.🎁', 'success', () => logout(true));
      } else {
        Swal.alert('회원탈퇴 실패', '들어올 땐 마음대로 들어왔지만 나갈 때 그럴 수 없습니다..🎁', 'error', () => logout(true));
      }
    } catch (error) {
      console.error('회원 탈퇴 처리 중 에러가 발생하였습니다.');
    }
  };

  useEffect(() => {
    if (isLoading) return; // 로딩 중일 때는 처리하지 않음
    if (!isLogin) {
      Swal.alert('로그인을 시도해주세요', '로그인 화면으로 이동합니다', 'warning', () => navigate('/login'));
    }
  }, [isLoading]);

  return (
    <div className='oswTicketBuyList'>
      <div className="oswUser" style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container1" style={{ flex: 1 }}>
          <h1>마이페이지</h1>
          <hr />
          <h1>마이페이지</h1>
          <div className="button-group">
            <br />
            <div className='btnAll'>
              <Link to="/User">
                <button className="active">내 정보</button>
              </Link>
              <Link to={`/buyList/users/${userNo}`}>
                <button>이용권 내역</button>
              </Link>
                <Link to={`/myPage/ptList/${userNo}`}>
                          <button>PT 이용 내역</button>
                          </Link>
               <Link to={`/myPage/boardList`}>
                          <button>내 문의사항</button>
                          </Link>
            </div>
          </div>
          <div className="wrapper">
            {/* 보유중인 이용권 */}
            <div className="main-text" style={{ color: "#ffffff", float: "left" }}>보유중인 이용권</div>
            <br />
            <br />
            <table className="info-table2" border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
 

  <tbody>
    {ticketBuyList.length > 0 && startedTicket ? (
      <>
      <tr>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', borderTop: 'none', backgroundColor: '#444444', padding: '15px 0' }}>이용권</td>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', padding: '15px 0' }}>{startedTicket.ticketName}</td>
</tr>
<tr>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', backgroundColor: '#444444', padding: '15px 0' }}>구매일시</td>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', padding: '15px 0' }}>{new Date(startedTicket.startDate).toLocaleDateString()}</td>
</tr>
<tr>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', backgroundColor: '#444444', padding: '15px 0' }}>만료일시</td>
  <td style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', padding: '15px 0' }}>{new Date(startedTicket.endDate).toLocaleDateString()}</td>
</tr>

      </>
    ) : (
      <tr>
        <td colSpan="2" style={{ textAlign: 'center', color: '#ffffff' }}>보유중인 이용권이 없습니다.</td>
      </tr>
    )}
  </tbody>
</table>


<div className="main-text" style={{ color: '#ffffff', marginTop: '30px', float: "left" }}>이용권 내역</div>
<br />
<br />
<br />
<table className="info-table2" border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{ width: '25%', textAlign: 'center', color: '#ffffff', backgroundColor: '#444444', borderBottom: '1px solid #ffffff', padding: '10px 0' }}>번호</th>
      <th style={{ width: '25%', textAlign: 'center', color: '#ffffff', backgroundColor: '#444444', borderBottom: '1px solid #ffffff', padding: '10px 0' }}>이용권</th>
      <th style={{ width: '30%', textAlign: 'center', color: '#ffffff', backgroundColor: '#444444', borderBottom: '1px solid #ffffff', padding: '10px 0' }}>가격</th>
      <th style={{ width: '40%', textAlign: 'center', color: '#ffffff', backgroundColor: '#444444', borderBottom: '1px solid #ffffff', padding: '10px 0' }}>구매일시</th>
    </tr>
  </thead>

  <tbody>
    {ticketBuyList.length > 0 ? (
      ticketBuyList.map((buy, index) => (
        <tr key={index}>
          <td style={{ textAlign: 'center', color: '#ffffff', borderBottom: '1px solid #ffffff' }}>{buy.no}</td>
          <td style={{ textAlign: 'center', color: '#ffffff', borderBottom: '1px solid #ffffff' }}>{buy.ticketName}</td>
          <td style={{ textAlign: 'center', color: '#ffffff', borderBottom: '1px solid #ffffff' }}>{new Intl.NumberFormat().format(buy.ticketPrice)} 원</td>
          <td style={{ textAlign: 'center', color: '#ffffff', borderBottom: '1px solid #ffffff' }}>{new Date(buy.buyDate).toLocaleString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" style={{ textAlign: 'center', width: '600px', color: '#ffffff' }}>구매 내역이 없습니다.</td>
      </tr>
    )}
  </tbody>
</table>



          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TicketBuyList;
