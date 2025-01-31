import React, { Children, createContext, useEffect, useState } from 'react'
import * as auth from '../apis/auth'
import Cookies from 'js-cookie'
import api from '../apis/api'
import * as Swal from '../apis/alert'
import { useNavigate } from 'react-router-dom'

// 📦 컨텍스트 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {

    // 로딩중
    const [isLoading, setIsLoading] = useState(true)
  // 🔐 로그인 여부
  const [isLogin, setIsLogin] = useState(false)
  // 👩‍💼 사용자 정보 
  const [userInfo, setUserInfo] = useState(null)
  // 💎 권한 정보
  const [roles, setRoles] = useState( {isUser : false, isAdmin : false, isTrainer : false} )

  // 페이지 이동
  const navigate = useNavigate()
  const storedToken = localStorage.getItem('autoLogin');
console.log(storedToken + "이거나옴?")

  // 🔐 로그인 함수
  const login = async (id, password) => {
    console.log(`username: ${id}`);
    console.log(`password: ${password}`);
  
    try {
      const response = await auth.login(id, password);
      const data = response.data;      // 👩‍💼 {user}
      const status = response.status;
      const headers = response.headers;
      const authorization = headers.authorization;
      const jwt = authorization.replace("Bearer ", "");
  
      console.log(`data: ${data}`);
      console.dir(data);
      console.log(`status: ${status}`);
      console.log(`headers: ${headers}`);
      console.log(`authorization: ${authorization}`);
      console.log(`jwt: ${jwt}`);
  
      // 로그인 성공 ✅
      if (status === 200) {

        
    
  
        // 로그인 세팅 - loginSetting(authorization, data)
        loginSetting(authorization, data);
  
        // 로그인 성공 alert
        Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success',
            () => navigate("/")
        );
  
        return jwt; // JWT 토큰 반환
  
      }
  
    } catch (error) {
      // 로그인 실패 alert
      Swal.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다', 'error');
      console.log('로그인 실패');
      return false;
    }
  };
  
  

  const logoutSetting = () => {
    // Authorization 헤더 초기화
    api.defaults.headers.common.authorization = undefined

    // JWT 쿠키 삭제
    Cookies.remove("jwt")
    localStorage.removeItem("jwt")
    sessionStorage.removeItem("jwtToken")
    localStorage.removeItem('jwtToken');
    //  로그인 여부 : false
    setIsLogin(false)
    localStorage.removeItem("isLogin")



    //  유저 정보 초기화
    setUserInfo(null)
    localStorage.removeItem("userInfo")

    // 권한 정보 초기화
    setRoles({ isUser: false, isAdmin: false, isTrainer: false })
    localStorage.removeItem("roles")
}



  // 🌞 로그아웃 함수
    // 로그아웃 함수
    const logout = (force = false) => {
      
      Swal.confirm("로그아웃 하시겠습니까?", "로그아웃을 진행합니다", "warning", (result) => {
        if (result.isConfirmed) {
            if (force) {
          
              setIsLoading(false)
              // 로그아웃 세팅
              Swal.alert("로그아웃 성공", "로그아웃 되었습니다.", "success",  () => navigate("/"))
              logoutSetting()
              
              setIsLoading(true)
      
                
            }
              // 로그아웃 세팅
              logoutSetting()

              // 페이지 이동 > "/" (메인)
             
              return
          }
      }
      )

   



  }
  const pwLogout = () => {
    Swal.alert("로그아웃 페이지로 이동합니다.", "다시 로그인 해주세요.", "warning",  logoutSetting())
        
              setIsLoading(true)
              // 로그아웃 세팅
              logoutSetting()
    
              setIsLoading(false)
    
              
              Swal.alert("로그아웃 성공", "로그아웃 되었습니다.", "success")
              navigate("/")
              
              // 페이지 이동 > "/" (메인)


  }

  // 자동 로그인
  // 🍪쿠키에 저장된 💍JWT 를 읽어와서 로그인 처리
  const autoLogin = async () => {
    // 로딩 시작
    setIsLoading(true);
  
    // 쿠키에서 jwt 가져오기
    const jwt = Cookies.get("jwt") || localStorage.getItem("jwt");
  
    if (!jwt) {
      // JWT가 없는 경우 바로 로딩 종료
      setIsLoading(false);
      return;
    }
  
    const authorization = `Bearer ${jwt}`;
    api.defaults.headers.common.Authorization = authorization;
  
    try {
      // 사용자 정보 요청
      const response = await auth.info();
  
      if (response.data === 'UNAUTHORIZED' || response.status === 401) {
        console.error('jwt가 만료되었거나 인증에 실패하였습니다.');
        logoutSetting(); // 인증 실패 시 로그아웃 처리
        setIsLoading(false); // 로딩 종료
        return;
      }
  
      // 인증 성공: 로그인 세팅
      loginSetting(authorization, response.data);
  
    } catch (error) {
      console.error(`autoLogin 에러: ${error}`);
      logoutSetting(); // 에러 발생 시 로그아웃 처리
    } finally {
      // 로딩 종료
      setIsLoading(false);
    }
  };
  
  /**
   * 로그인 세팅
   * @param {*} authorization : Bearre {jwt}
   * @param {*} data          : 👩‍💼{ user }
   */
  const loginSetting = (authorization, data) => {
    // 💍 JWT 를 Authorizaion 헤더에 등록
    api.defaults.headers.common.Authorization = authorization

    // 로그인 여부 
    setIsLogin(true)
    // 사용자 정보
    setUserInfo(data)
    // 권한 정보
    const updatedRoles = { isUser: false, isAdmin: false, isTrainer: false }
    data.authList.forEach( (obj) => {
      if( obj.auth == 'ROLE_USER' ) updatedRoles.isUser = true
      if( obj.auth == 'ROLE_ADMIN' ) updatedRoles.isAdmin = true
      if( obj.auth == 'ROLE_TRAINER' ) updatedRoles.isTrainer = true
    })
    setRoles(updatedRoles)
  }

  useEffect( () => {
    // 자동 로그인
    // 1️⃣ 쿠키에서 jwt 가져오기
    // 2️⃣ jwt 있으면, 사용자 정보 요청
    // 3️⃣ 로그인 세팅 ( 📦 로그인 여부, 사용자 정보, 권한 )
    autoLogin()
  }, [])
  

  return (
    // 컨텍스트 값 지정 ➡ value={ ?, ? }
    <LoginContext.Provider value={ { pwLogout, isLogin, logout, login, userInfo, roles, isLoading, setUserInfo, autoLogin,   logoutSetting } }>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvider