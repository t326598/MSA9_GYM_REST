import React, { useContext, useEffect } from 'react'
import Header from '../../../components/admin/Header/adminHeader';
import AdminFooter from '../../../components/admin/Header/adminFooter';
import UserListContainer from '../../../containers/User/UserListContainer'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../../contexts/LoginContextProvider';


const UserList = () => {

  const { isLogin, userInfo, roles, isLoading } = useContext(LoginContext)
  const navigate = useNavigate();

  useEffect(() => {

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
      <UserListContainer />
      <AdminFooter />

    </>
  )
}

export default UserList