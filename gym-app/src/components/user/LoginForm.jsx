import React, { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // js-cookie 임포트
import { LoginContext } from '../../contexts/LoginContextProvider';
import logo from '../../assets/imges/logo2.png';
import '../user/css/login.css';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { isLogin, login, logout, userInfo } = useContext(LoginContext);
  const [rememberId, setRememberId] = useState(false); 
  const [autoLogin, setAutoLogin] = useState(false); 
  const [savedId, setSavedId] = useState('');

  useEffect(() => {
    const storedId = Cookies.get('remember-id'); // 쿠키에서 저장된 아이디 가져오기
    const storedToken = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 토큰 가져오기

    console.log(rememberId)

    if (storedId) {
      setSavedId(storedId);
      setRememberId(true); // 아이디 저장 체크 활성화
    }

    if (storedToken) {
      setAutoLogin(true); // 자동 로그인 체크 활성화
    }
  }, []);

  useEffect(() => {
    if (!isLogin) {
      setAutoLogin(false); // 로그아웃 시 자동 로그인 해제
    }
  }, [isLogin]);

  const onLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const password = form.password.value;

    // 아이디 저장 처리
    if (rememberId) {
        Cookies.set('remember-id', id, { expires: 7 }); // 쿠키에 아이디 저장, 7일 동안 유지
    } else {
        Cookies.remove('remember-id'); // 쿠키에서 아이디 삭제
    }

    // 로그인 처리
    login(id, password).then((token) => {
        if (token) {
            if (autoLogin) {
                console.log("이거나옴1");
                localStorage.setItem('jwtToken', token); // 자동 로그인: 로컬 스토리지에 토큰 저장
            } else {
                console.log("이거나옴23");
                localStorage.setItem('jwt', token, { expires: 5 }); // 세션 로그인: 세션 스토리지에 토큰 저장
            }
            // 여기서 jwtToken을 다시 가져와 확인할 수 있습니다
            const storedToken = localStorage.getItem('jwtToken');
            console.log(`storedToken after setting: ${storedToken}`);
            if (storedToken !== null) {
                Cookies.set("jwt", token, { expires: 5 }); // 쿠키에 토큰 저장
            }
        } else {
            // 로그인 실패 시
            console.log("로그인 실패 - 토큰이 유효하지 않음");
        }
    });
};


  return (

  <div className="login">
  
      <body>
      <div className="fullBody">
        <div className="container12">
          <div className="container1">
            <div className="textcenter">
              <img className="FITlogo" src={logo} alt="Logo" />
              <h1>로그인</h1>
            </div>

            <div className="formsignin">
              <form onSubmit={onLogin}>
                <div className="form-floating">
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="아이디"
                    autoFocus
                    required
                    defaultValue={savedId} // 저장된 아이디 표시
                  />
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="비밀번호"
                    required
                  />
                </div>

                <div className="form-check">
                  <div className="item">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember-id-check"
                      checked={rememberId}
                      onChange={(e) => setRememberId(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="remember-id-check"
                    >
                      아이디 저장
                    </label>
                  </div>
                  <div className="item">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember-me-check"
                      checked={autoLogin}
                      onChange={(e) => setAutoLogin(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="remember-me-check"
                    >
                      자동 로그인
                    </label>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button type="submit">로그인</button>
                </div>
                <br />
                <br />
                <div className="subbutton">
                  <a href="/join">회원가입</a>
                  <span>|</span>
                  <Link to="/findId">아이디 찾기</Link>
                  <span>|</span>
                  <Link to="/FindPw">비밀번호 찾기</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </body>
    </div>
  );
};

export default LoginForm;
