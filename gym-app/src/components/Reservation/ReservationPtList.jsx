import React, { useContext, useEffect, useState } from 'react'
import * as format from '../../utils/format';
import './Reservation.css'
import * as Swal from '../../apis/alert';
import { useNavigate } from 'react-router-dom';
import ReservationListModal from './ReservationListModal';
import { LoginContext } from '../../contexts/LoginContextProvider';

const ReservationPtList = ({ reservations, handlePageChange, page, fetchList, ptCount, disabledCount }) => {

  const {isLoading, userInfo, isLogin } = useContext(LoginContext)
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationNo, setSelectedReservationNo] = useState(null);

  const navigate = useNavigate()

  const [userNo, setUserNo] = useState(null);

  const showCancelModal = (reservationNo) => {
    setSelectedReservationNo(reservationNo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReservationNo(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
  //    if (isLoading) {
  //      // 로딩 중일 때는 아무 동작도 하지 않음
  //      return;
  //    }
   
  //    // 로딩 완료 후 로그인 여부 확인
  //    if (!isLogin) {
  //      Swal.alert('로그인을 시도해주세요', '로그인 화면으로 이동합니다', 'warning', () => {
  //        navigate('/login');
  //      });
  //      return;
  //    }
   
     // 로그인되어 있다면 userInfo를 확인
     if (userInfo && userInfo.no) {
       setUserNo(userInfo.no);
       console.log('userNo:', userInfo.no);
     } else {
       console.log('userInfo가 없거나 userNo가 없습니다.');
     }
   }, [isLoading, userInfo, navigate]);


  return (
    <>
      <body className="fullBody ptList" style={{ color: "rgb(3, 3, 3)", backgroundColor: "#333" }}>
        <div className="wrapper" style={{ marginTop: '80px', marginBottom: "0" }}>
          <main>
            <div className="main-text1" style={{ color: '#9FD0D5' }}>마이페이지</div>

            <div className="button-group">
              <button onClick={() => navigate('/User')}>내 정보</button>
              <button onClick={() => navigate(`/buyList/users/${userNo}`)}>이용권 내역</button>
              <button className="active" onClick={() => navigate(`/myPage/ptList/${userNo}`)}>PT 이용 내역</button>
              <button onClick={() => navigate('/myPage/BoardList')}>내 문의사항</button>
            </div>

            <div className="pt-count">
              <div className="disabled-count">
                <span>완료 PT 횟수 : </span>
                <span>{disabledCount}</span>
              </div>
              <div className="pt-count-container">
                <span>남은 PT 횟수 : </span>
                <span>{ptCount}</span>
              </div>
            </div>
          </main>
        </div>

        <div className="list">
          <table>
            <thead style={{ fontWeight: 'bold' }}>
              <tr>
                <th>담당 트레이너</th>
                <th>예약 날짜</th>
                <th>신청 일시</th>
                <th>완료/취소 일시</th>
                <th style={{width: "140px"}}>상태</th>
              </tr>
            </thead>
            <tbody>
              {
                reservations.length == 0
                  ?
                  <tr>
                    <td colSpan={7} align='center'>조회된 데이터가 없습니다.</td>
                  </tr>
                  :
                  reservations.map((reservation) => {
                    return (
                      <tr key={reservation.no}>
                        <td>{reservation.trainerName}</td>
                        <td style={{ fontWeight: "bold" }}>{format.formatRvDate(reservation.rvDate)}</td>
                        <td>{format.formatDate(reservation.createdAt)}</td>
                        {reservation.enabled == 2 ? (
                          <td style={{ color: "#2a9c1b" }}>
                            {format.formatDate(reservation.canceledAt)}</td>
                        )
                          : reservation.enabled == 1 ? (
                            <td></td>
                          )
                            : reservation.enabled == 0 ? (
                              <td style={{ color: '#dc3545' }}>
                                {format.formatDate(reservation.canceledAt)}</td>
                            )
                              : null}
                        <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          {reservation.enabled == 1 && (
                            <>
                              <button
                                type="button"
                                className="cancel"
                                data-no={reservation.no}
                                onClick={() => showCancelModal(reservation.no, "cancel")}
                              >
                                취소하기
                              </button>
                            </>
                          )}
                          {reservation.enabled == 2 && <span className="ptComplete">완료</span>}
                          {reservation.enabled == 0 && <span className="cancel-text">취소</span>}
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <a
            onClick={() => handlePageChange(page.first)}
            className={`pagetag first ${page.page === page.first}`}
          >
            [처음]
          </a>
          {page.page !== page.first && (
            <a
              onClick={() => handlePageChange(page.page - 1)}
              className={`pagetag prev ${page.page === page.first ? "disabled" : ""}`}
            >
              [이전]
            </a>
          )}
          {Array.from({ length: page.end - page.start + 1 }, (_, idx) => page.start + idx).map((no) => (
            <a
              key={no}
              onClick={() => handlePageChange(no)}
              className={`pagetag ${page.page === no ? "active" : ""}`}
            >
              {no}
            </a>
          ))}
          {page.page !== page.last && (
            <a
              onClick={() => handlePageChange(page.page + 1)}
              className={`pagetag next ${page.page === page.last ? "disabled" : ""}`}
            >
              [다음]
            </a>
          )}
          <a
            onClick={() => handlePageChange(page.last)}
            className={`pagetag last ${page.page === page.last}`}
          >
            [마지막]
          </a>
        </div>
      {isModalOpen && (
        <ReservationListModal
          reservationNo={selectedReservationNo}
          action="cancel"
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          reservations={reservations}
          fetchList={fetchList}
          role="user"
          no={userNo}
          page={page}
          />
      )}
      </body>
    </>
  )
}

export default ReservationPtList
