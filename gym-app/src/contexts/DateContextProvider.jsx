import React, { createContext, useContext, useEffect, useState } from 'react'
import * as plan from '../apis/plan'
import { LoginContext } from './LoginContextProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Swal from '../apis/alert'

const DateContext = createContext();

export const useDate = () => useContext(DateContext);

const DateContextProvider = ({children}) => {

  const { roles, autoLogin, isLoading } = useContext(LoginContext)
  const location = useLocation();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [comment, setComment] = useState();
  const [planList, setPlanList] = useState([]);
  const [rsvList, setRsvList] = useState([]);
  
  const [clickedPlan, setClickedPlan] = useState({id: null, title: '', eventStart: null, eventEnd: null, description: ''});
  const [clickedRsv, setClickedRsv] = useState({id: null, title: '', eventStart: null, eventEnd: null, description: ''});
  const [isPlanInsertVisible, setIsPlanInsertVisible] = useState(false);
  const [isPlanInfoVisible, setIsPlanInfoVisible] = useState(false);
  const [isRsvInfoVisible, setIsRsvInfoVisible] = useState(false);

  const navigate = useNavigate();

  const getDataListByDate = async (date) => {
    // console.log("getDataListByDate")
    const formDate = new Date(date)
    const year = formDate.getFullYear();
    const month = (formDate.getMonth() + 1);
    const day = formDate.getDate();
    // console.log(`year/month/day : ${year}/${month}/${day}`)
    const response = await plan.getPlansbyDate(year, month, day)
    const data = await response.data

    // console.dir(data)
    // console.dir(data.comment)
    // console.dir(data.planEvents)
    // console.dir(data.reservationEvents)

    setComment(data.comment)
    setPlanList(data.planEvents)
    setRsvList(data.reservationEvents)

  };
  const getPlansbyDateUserNo = async (date) => {
    // console.log("getPlansbyDateUserNo")
    const params = new URLSearchParams(location.search);
    const userNo = params.get('userNo');
    const formDate = new Date(date)
    const year = formDate.getFullYear();
    const month = (formDate.getMonth() + 1);
    const day = formDate.getDate();

    const response = await plan.getPlansbyDateUserNo(year, month, day, userNo)
    const data = await response.data

    // console.dir(data)
    // console.dir(data.comment)
    // console.dir(data.planEvents)
    // console.dir(data.reservationEvents)

    setComment(data.comment)
    setPlanList(data.planEvents)
    setRsvList(data.reservationEvents)

  };

  const getDataList = async () => {
    const response = await plan.getPlans()
    const data = await response.data
    // console.dir(response)
    // console.dir(data)
    // console.dir(data.comment)
    // console.dir(data.planEvents)
    // console.dir(data.reservationEvents)
    
    setComment(data.comment)  
    setPlanList(data.planEvents)
    setRsvList(data.reservationEvents)
  
  };

  const getPlansbyUserNo = async () => {
    const params = new URLSearchParams(location.search);
    const userNo = params.get('userNo');
    // console.log("getPlansbyUserNo : " + userNo)
    const response = await plan.getPlansbyUserNo(userNo)
    const data = await response.data

    setComment(data.comment)
    setPlanList(data.planEvents)
    setRsvList(data.reservationEvents)
  }
    
  const formatPlanTime = (start, end) => {
    const startDate = new Date(start) 
    const endDate = new Date(end)
    const startHours = startDate.getHours();
    const endHours = endDate.getHours();

    const startTime = `${startHours >= 12? '오후':'오전'} ${startHours}:${startDate.getMinutes().toString().padStart(2, '0')}`
    const endTime = `${endHours >= 12? '오후':'오전'} ${endHours}:${endDate.getMinutes().toString().padStart(2, '0')}`
    const formattedDate = `${startDate.getMonth() + 1}/${startDate.getDate()} (${startDate.toLocaleDateString('ko-KR', { weekday: 'short' })})`;

    return { startTime: startTime, endTime: endTime, formattedDate: formattedDate }
  }

  useEffect(() => {
    const fetchData = async () => {
      if(isLoading){
        return;
      }

      await autoLogin();

      const params = new URLSearchParams(location.search);
      const userNo = params.get('userNo');
      try {
        if (roles.isUser) {
          if(userNo===null){
            await getDataListByDate(currentDate);
          } else {
            Swal.alert('접근할 수 없습니다.', '접근할 권한이 없습니다.', 'warning', () => {
                      navigate('/');
                    });
          }
        } else if(roles.isTrainer) {
          if(userNo != null) {
            await getPlansbyDateUserNo(currentDate);
          } else {
            Swal.alert('접근할 수 없습니다.', '회원번호가 필요합니다.', 'warning', () => {
                          navigate('/');
            });
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.alert('접근 불가', '접근 가능 권한이 아닙니다.', 'warning', () => {
            navigate('/');
          });
        } else {
          console.error(error);
        }
      }
      
      setIsPlanInfoVisible(false);
      setIsRsvInfoVisible(false);
    };

    fetchData();
  }, [currentDate]);

  useEffect(() => {
    if (isPlanInfoVisible) {
      setIsPlanInsertVisible(false)
      setIsRsvInfoVisible(false)
    }
  }, [isPlanInfoVisible])

  useEffect(() => {
    if (isPlanInsertVisible) {
      setIsPlanInfoVisible(false)
      setIsRsvInfoVisible(false)
    }
  }, [isPlanInsertVisible])

  useEffect(() => {
    if (isRsvInfoVisible) {
      setIsPlanInsertVisible(false)
      setIsPlanInfoVisible(false)
    }
  }, [isRsvInfoVisible])
  
    

  return (
    <DateContext.Provider value={{ 
      currentDate, setCurrentDate, comment, planList, rsvList, getDataList, formatPlanTime, 
      clickedPlan, setClickedPlan, clickedRsv, setClickedRsv,
      isPlanInsertVisible, setIsPlanInsertVisible, isPlanInfoVisible, setIsPlanInfoVisible,
      isRsvInfoVisible, setIsRsvInfoVisible,
      getDataListByDate, getPlansbyUserNo, getPlansbyDateUserNo
      }}>
      {children}
    </DateContext.Provider>
  )
}

export default DateContextProvider