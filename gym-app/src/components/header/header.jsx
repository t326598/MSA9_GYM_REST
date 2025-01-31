import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import './header.css';

function Header() {
    const { isLogin: isAuthenticated, userInfo, roles, logout } = useContext(LoginContext);

    useEffect(() => {
        const menuBtn = document.getElementById('menu-btn');
        const menu = document.getElementById('menu');

        const handleMenuToggle = () => {
            menuBtn.classList.toggle('open');
            menu.classList.toggle('open');
        };

        menuBtn.addEventListener('click', handleMenuToggle);

        return () => {
            menuBtn.removeEventListener('click', handleMenuToggle);
        };
    }, []);

    const handleQrSubmit = () => {
        document.getElementById('qrForm').submit();
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout(true);
    };

    // 유저 권한을 userInfo.authList에서 가져오기
    const userRole = userInfo?.authList?.[0]?.auth;

    return (
        <div className="oswHeader">
            <header className="header">
                <div className="menu-btn" id="menu-btn">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="logo">
                    <Link to="/">
                        <img src="/images/logo.png" alt="FITNEXUS Logo" />
                    </Link>
                </div>
                <nav className="nav-links">
                    {!isAuthenticated && (
                        <>
                            <Link to="/join">회원가입</Link>
                            <Link to="/login">로그인</Link>
                        </>
                    )}
                  {isAuthenticated && (
    <>
        <Link to="/generate-qr-code">
            <i className="fa-solid fa-bell" style={{ marginRight: '10px' }}></i>
            헬스장 입장
        </Link>

        {/* 관리자 권한이 아닐 때만 마이페이지 표시 */}
        {userRole !== 'ROLE_ADMIN' && userRole !== 'ROLE_TRAINER' && (
            <Link to="/User">
                <i className="fa-solid fa-bell" style={{ marginRight: '10px' }}></i>
                마이페이지
            </Link>
        )}


        {/* 관리자 또는 트레이너일 때 관리자 페이지 표시 */}
        {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_TRAINER') && (
            <Link to="/admin/userList">관리자페이지</Link>
        )}
        <a href="#" onClick={handleLogout}>로그아웃</a>
    </>
)}

                </nav>

                <div className="menu" id="menu">
                    {isAuthenticated ? (
                        // 로그인 된 상태일 때
                        <>
                            <p style={{ textAlign: 'center' }}>{userInfo?.name} 님 환영합니다.</p>
                            <ul>
                                <li><Link to="/ranking">출석 랭킹</Link></li>
                                <li><Link to="/ticket/ChoiceTicket">이용권 구매</Link></li>
                                <li><a href="/plan/plan">운동계획표</a></li>
                                <li><Link to={`/reservation/reservationInsert/${userInfo?.trainerNo}`}>PT 예약</Link></li>
                                <li><Link to="/boardList">문의게시판</Link></li>
                            </ul>
                        </>
                    ) : (
                        // 로그인 안된 상태일 때
                        
                        <>
                         <p style={{ textAlign: 'center' }}>{userInfo?.name} 로그인이 필요합니다.</p>
                        <ul>
                            <li><Link to="/ranking">출석 랭킹</Link></li>
                            <li><Link to="/ticket/ChoiceTicket">이용권 구매</Link></li>
                            <li><Link to="/boardList">문의게시판</Link></li>
                        </ul>
                        
                        </>
                    )}
                </div>


            </header>
        </div>
    );
}

export default Header;
