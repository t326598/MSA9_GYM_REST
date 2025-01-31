import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReservationList from "../../components/Reservation/ReservationList";
import { LoginContext } from "../../contexts/LoginContextProvider";
import * as reservation from '../../apis/reservation'
import ReservationPtList from "../../components/Reservation/ReservationPtList";

const ReservationListContainer = () => {
  const { userInfo } = useContext(LoginContext);
  const [reservations, setReservations] = useState([]);
  const [disabledCount, setDisabledCount] = useState(0)
  const [ptCount, setPtCount] = useState(0)
  const [option, setOption] = useState({
    keyword: "",
    rows: 10,
    orderCode: 0,
    code: 0,
  });
  const [page, setPage] = useState({
    page: 1,
    rows: 10,
    first: 1,
    last: 1,
    start: 1,
    end: 1,
  });

  const location = useLocation();

  const fetchList = async (pageNumber = 1, currentOption = option) => { 
    if (!userInfo || !userInfo.no) return;

    try {
      let response;
      if (location.pathname.includes("/myPage/ptList")) {
        console.log("로그인 유저 번호 : " +  userInfo.no);  

        response = await reservation.userByList(userInfo.no, pageNumber, currentOption.rows);

        const data = response.data
        console.dir("예약 데이터 : " + data.reservationList)
        console.dir("페이지 데이터 : " + data.page)
        setReservations(data.reservationList)
        setPtCount(data.ptCount)
        setDisabledCount(data.disabledCount)
        setPage(data.page)
      } else {
        response = await fetch(
          `http://192.168.30.63:8080/admin/reservation/list?page=${pageNumber}&rows=${currentOption.rows}&keyword=${currentOption.keyword}&orderCode=${currentOption.orderCode}&code=${currentOption.code}`
        );
        if (response.ok) {
          const { reservationList, page: newPage } = await response.json();
          setReservations(reservationList);
          setPage(newPage);
          console.log("응답 결과 : " + reservationList);
        } else {
          console.error("데이터 요청 실패");
        }
      }

    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  useEffect(() => {
    console.log("현재 경로:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (userInfo && userInfo.no) {
      fetchList();
    }
  }, [userInfo]);

  const handleSearch = (updatedOption = option) => {
    fetchList(1, updatedOption);
  };

  const handlePageChange = (pageNumber) => {
    fetchList(pageNumber, option);
  };

  if (!userInfo) {
    return null;
  }

  if (location.pathname.includes('/myPage/ptList')) {
    return (
      <ReservationPtList
        reservations={reservations}
        option={option}
        page={page}
        handlePageChange={handlePageChange}
        setOption={setOption}
        onSearch={handleSearch}
        fetchList={fetchList}
        ptCount={ptCount}
        disabledCount={disabledCount}
      />
    );
  } else {
    return (
      <ReservationList
        reservations={reservations}
        option={option}
        page={page}
        handlePageChange={handlePageChange}
        setOption={setOption}
        onSearch={handleSearch}
        fetchList={fetchList}
      />
    );
  }
};

export default ReservationListContainer;
