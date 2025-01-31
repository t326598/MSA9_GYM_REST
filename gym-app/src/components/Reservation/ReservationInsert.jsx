import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as reservation from '../../apis/reservation'
import * as format from '../../utils/format';
import * as Swal from '../../apis/alert'
import './Reservation.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const ReservationInsert = ({ trainerProfile, reservationByTrainer, no, ptCount }) => {

  
  
  const {userInfo} = useContext(LoginContext)
  const [userNo, setUserNo] = useState(null);
  
  useEffect(() => {
    console.log('userInfo:', userInfo); 
    
    if (userInfo && userInfo.no) { 
      setUserNo(userInfo.no);
      console.log('userNo:', userInfo.no);
    } else {
      console.log('userInfo가 없거나 userNo가 없습니다.');
    }
  }, [userInfo]);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [timeButtons, setTimeButtons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  
  const navigate = useNavigate();
  
  
  
  useEffect(() => {
    if (selectedDate) {
      generateTimeButtons(selectedDate);
    }
  }, [selectedDate]);
  
  const generateTimeButtons = (date) => {
    const buttons = [];
    for (let hour = 10; hour <= 21; hour++) {
      const selectedDateTime = new Date(`${date}T${hour}:00`);
      const isReserved = reservationByTrainer.some((reservation) => {
        const reservationDate = new Date(reservation.rvDate);
        return reservationDate.getTime() === selectedDateTime.getTime();
      });
      const isPast = selectedDateTime.getTime() <= new Date().getTime();
      
      buttons.push({
        time: `${hour}:00`,
        disabled: isReserved || isPast,
        isReserved,
      });
    }
    setTimeButtons(buttons);
  };
  
  const handleDateClick = (info) => {
    console.log("피티카운트 : " + ptCount);
    if (ptCount <= 0) {
      Swal.alert('이용 가능한 PT가 없습니다.', '이용권을 추가로 구매해주세요.', 'warning', () => {
          navigate('/ticket/ChoiceTicket');
        }
      );
      return;
    }
    setSelectedDate(info.dateStr);
    setModalVisible(true);
  };
  
  const handleTimeClick = (time) => {

    if (confirm(`${selectedDate} ${time} 예약하시겠습니까?`)) {
      submitReservation(selectedDate, time);
    }
  };

  const submitReservation = async (date, time) => {
    const data = {
      trainerNo: no,
      rvDate: new Date(`${date}T${time}`).toISOString(),
    };

    try {
      const response = await reservation.insert(data);
      setData(response);

      console.log("예약 시간 : " + data.rvDate);

      // 버튼 상태 즉시 업데이트
      setTimeButtons((prevButtons) =>
        prevButtons.map((button) =>
          button.time === time ? { ...button, disabled: true, isReserved: true } : button
        )
      );

      Swal.alert("예약이 완료되었습니다.");

      navigate(`/myPage/ptList/${userInfo.no}`);
      setModalVisible(false);
    } catch (error) {
      Swal.alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="ReservationInsert"> 
      <div className="ReservationInsert-container">
        <div className="hr">
          <span>PT 예약</span>
        </div>
        <div className="trainer-info">
          <div className="info-container">
            <img
              src={`/api/files/${trainerProfile.no}/thumbnail`}
              alt="트레이너이미지"
              className="card-img-top"
              style={{
                width: '500px',
                height: '450px',
              }}
            />
            <div className="info">
              <h1>{trainerProfile.name}</h1>
            </div>
          </div>
        </div>
        <div className="hr2"></div>
        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
          />
        </div>
        {modalVisible && (
          <div id="timeSelectionModal" className={modalVisible ? 'show' : ''}>
            <div className="modal-container">
              <div className="modal-info">
                <p className="modal-info-timeSelect">예약 시간 선택</p>
                <p id="selectedDate"> {selectedDate}</p>
              </div>
              <div id="timeButtons">
                {timeButtons.map((button, index) => (
                  <button
                    key={index}
                    disabled={button.disabled}
                    onClick={() => handleTimeClick(button.time)}
                    style={{
                      cursor: button.disabled ? 'not-allowed' : 'pointer',
                      backgroundColor: button.disabled ? 'gray' : 'royalblue',
                    }}
                  >
                    {button.time}
                  </button>
                ))}
              </div>
              <button
                className="modalCloseButton"
                onClick={closeModal}
                style={{
                  width: '50px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'color 0.3s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ReservationInsert;
