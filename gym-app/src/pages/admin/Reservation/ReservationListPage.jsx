import React, { useContext, useEffect } from 'react'
import ReservationListContainer from '../../../containers/Reservation/ReservationListContainer'
import Header from '../../../components/admin/Header/adminHeader'
import Sidebar from '../../../components/admin/Header/adminSidebar'
import { LoginContext } from '../../../contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
import * as Swal from '../../../apis/alert'

const ReservationListPage = () => {

  const { isLogin, userInfo, roles, isLoading } = useContext(LoginContext)
  const navigate = useNavigate();

  useEffect(() => {
    // if (isLoading) {
    //   return;
    // }

    if (!isLogin) {
      Swal.alert('로그인을 시도해주세요', '로그인 화면으로 이동합니다', 'warning', () => {
        navigate('/login');
      });
      return;
    }

    if (!userInfo) {
      Swal.alert('잘못된 접근입니다.', '메인 화면으로 이동합니다.', 'warning', () => {
        navigate('/');
      });
      return;
    }

    console.log("권한 : " + roles.isUser);

    if (roles.isUser) {
      Swal.alert('권한이 없습니다.', '메인 화면으로 이동합니다.', 'warning', () => {
        navigate('/');
      });
      return;
    }

  }, [isLoading, isLogin, userInfo, roles, navigate]);

  if (!isLogin || !userInfo || roles.isUser) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="reservationList-container">
        <Sidebar />
        <div className="main">
          <div className="inner">
            <div className="title">
              <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>PT 예약 및 완료 목록</h2>
            </div>
            <ReservationListContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default ReservationListPage
