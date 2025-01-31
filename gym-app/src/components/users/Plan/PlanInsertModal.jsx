import React, { useEffect, useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useDate } from "../../../contexts/DateContextProvider";
import * as plan from '../../../apis/plan'

const PlanInsertModal = ({times24Hour, times12Hour, setTimes24Hour, setTimes12Hour, setupDropdown, onClose}) => {

  const { currentDate, getDataListByDate, setIsPlanInsertVisible } = useDate();

  const [planName, setPlanName] = useState('')
  const [planContent, setPlanContent] = useState('')

  const changePlanName = (e) => {setPlanName(e.target.value)}
  const changePlanContent = (e) => {setPlanContent(e.target.value)}

  // ⚪❗ 초기값 세팅하기
  const [start, setStart] = useState(currentDate)
  const [end, setEnd] = useState(currentDate)
  const [formattedDate, setFormattedDate] = useState('');

  const setTime = (type, time) => {
    const isStart = type === "start"; 
    const baseDate = new Date(isStart ? start : end);
  
    const [hours, minutes] = time.split(':').map(Number); 
    baseDate.setHours(hours, minutes, 0);
    
    console.log(`${type}(setTime):`, baseDate);
    
    isStart ? setStart(baseDate) : setEnd(baseDate);
  };

  useEffect(() => {
    // 드롭다운 세팅
    const cleanupStart = setupDropdown("dropdown-button-start", "options-start");
    const cleanupEnd = setupDropdown("dropdown-button-end", "options-end");

    return () => {
      cleanupStart();
      cleanupEnd();
    };
  }, [setupDropdown]);

  useEffect(() => {
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()} (${currentDate.toLocaleDateString('ko-KR', { weekday: 'short' })})`;
    setFormattedDate(formattedDate);
    console.log("currentDate formattedDate: " + formattedDate);
  }, [currentDate]);

  const handleInsertPlan = async () => {
    const data = {
      planName: planName,
      planContent: planContent,
      planTime: start,
      planEnd: end
    };

    try {
      const response = await plan.insert(data);
      console.log('planInsert 응답:', response.data);
    } catch (error) {
      console.error('오류 발생:', error.response ? error.response.data : error.message);
    }
    getDataListByDate(currentDate)
    setIsPlanInsertVisible(false)
  }
  
  return (
    <div className='pop-up input-schedule'>
      <div className="popup-type">
        <div className="icons">
          <a className="input-schedule-close" onClick={onClose}><CloseRoundedIcon /></a>          
        </div>
      </div>
      <div className="popup-content">
        <div>
          <div className="popup-title-input">
            <input type="text" name="planName" placeholder="일정 제목 추가" onChange={changePlanName} />
          </div>
          <div className="set-time">
            <p><AccessTimeRoundedIcon /></p>
            <div className="set-time-date">
              <span>{formattedDate}</span>
            </div>
            <div className="set-time-drops">
              <div className="dropdown">
                <button type="button" id="dropdown-button-start">시작 시간</button>
                <div className="options" id="options-start">
                  {times24Hour.map((time, index) => (
                      <div 
                        key={time}
                        onClick={() => setTime('start', time)}
                      >
                       {times12Hour[index]} 
                      </div>
                  ))}
                </div>
              </div>
              <span>-</span>
              <div className="dropdown">
                <button type="button" id="dropdown-button-end">종료 시간</button>
                <div className="options" id="options-end">
                  {times24Hour.map((time, index) => (
                      <div 
                        key={time}
                        onClick={() => setTime('end', time)}
                      >
                       {times12Hour[index]} 
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <textarea name="planContent" placeholder="내용 입력" onChange={changePlanContent}></textarea>
          <div className="button-container">
            <button onClick={handleInsertPlan} id="updPlanButton">저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanInsertModal