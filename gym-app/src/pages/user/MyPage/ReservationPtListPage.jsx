import React, { useContext, useEffect } from 'react'
import ReservationListContainer from '../../../containers/Reservation/ReservationListContainer'
import Header from '../../../components/header/header'
import Footer from '../../../components/Footer/footer'
import { useNavigate, useParams } from 'react-router-dom'
import { LoginContext } from '../../../contexts/LoginContextProvider'
import * as Swal from '../../../apis/alert';

const ReservationPtListPage = () => {

  const { isLogin, userInfo, isLoading } = useContext(LoginContext)
  const navigate = useNavigate();

  const { no } = useParams()

  useEffect(() => {
    console.log("유저인포 있나? " + userInfo);
    console.log("유저넘버 있나? " + userInfo.no);
    console.log("유저넘버랑 파람no랑 같나? " + no);


    if (!isLogin) {
      Swal.alert('로그인을 시도해주세요', '로그인 화면으로 이동합니다', 'warning', () => {
        navigate('/login');
      });
      return;
    }

    if (!userInfo || userInfo.no != no) {
      
      Swal.alert('잘못된 접근입니다.', '메인 화면으로 이동합니다.', 'warning', () => {
        navigate('/');
      });
      return;
    }
  }, [isLoading, isLogin, userInfo, no, navigate]);

  if (!isLogin || !userInfo || userInfo.no != no) {
    return null;
  }


  return (
    <>
      <Header />
      <ReservationListContainer />
      <Footer />
    </>
  )
}

export default ReservationPtListPage
