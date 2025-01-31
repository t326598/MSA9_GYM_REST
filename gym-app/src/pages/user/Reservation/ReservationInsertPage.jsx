import React, { useContext, useEffect } from 'react';
import Footer from '../../../components/Footer/footer';
import Header from '../../../components/header/header';
import ReservationInsertContainer from '../../../containers/Reservation/ReservationInsertContainer';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import * as Swal from '../../../apis/alert';

const ReservationInsertPage = () => {
  const { isLogin, userInfo, isLoading } = useContext(LoginContext);
  const navigate = useNavigate();

  const { no } = useParams();

  useEffect(() => {

    if (!isLogin) {
      Swal.alert('로그인을 시도해주세요.', '로그인 화면으로 이동합니다.', 'warning', () => {
        navigate('/login');
      });
      return;
    }

    if (!userInfo || userInfo.trainerNo != no || userInfo.trainerNo == 0) {
      Swal.alert('PT이용권이 없습니다.', '이용권을 구매해 주세요.', 'warning', () => {
        navigate('/');
      });
      return;
    }
  }, [isLoading, isLogin, userInfo, no, navigate]);

  if (!isLogin || !userInfo || userInfo.trainerNo != no || userInfo.trainerNo == 0) {
    return null;
  }

  return (
    <>
      <Header />
      <ReservationInsertContainer />
      <Footer />
    </>
  );
};

export default ReservationInsertPage;
