import React, { useContext, useEffect } from 'react'
import Header from '../../../components/admin/Header/adminHeader'
import Sidebar from '../../../components/admin/Header/adminSidebar'
import ReservationCalendarContainer from '../../../containers/Reservation/ReservationCalendarContainer'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../../contexts/LoginContextProvider'
import * as Swal from '../../../apis/alert'

const Calendar = () => {

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
              <h2 style={{fontWeight : 'bold', fontSize : '20px'}}>월별 PT 예약 및 완료 일정</h2>
            </div>
            <ReservationCalendarContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Calendar
