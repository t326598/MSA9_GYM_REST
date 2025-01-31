import React, { useContext, useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useDate } from '../../../contexts/DateContextProvider';
import * as plan from '../../../apis/plan'
import { LoginContext } from '../../../contexts/LoginContextProvider';

const PlanInfoModal = ({times24Hour, times12Hour, setupDropdown, onClose}) => {

  const { roles } = useContext(LoginContext)
  
  const { currentDate, clickedPlan, formatPlanTime, setIsPlanInfoVisible, getDataListByDate } = useDate();

  const [id, setId] = useState('');
  const [title, setTitle] = useState('')
  const [eventStart, setEventStart] = useState()
  const [eventEnd, setEventEnd] = useState()
  const [description, setDescription] = useState('')
  const [isEditMode, setIsEditMode] = useState(false);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [formattedDate, setFormattedDate] = useState('');

  const [startEdit, setStartEdit] = useState(new Date(clickedPlan.eventStart))
  const [endEdit, setEndEdit] = useState(new Date(clickedPlan.eventEnd))

  useEffect(() => {
    const cleanupStart = setupDropdown("dropdown-edit-start", "options-edit-start");
    const cleanupEnd = setupDropdown("dropdown-edit-end", "options-edit-end");

    return () => {
      cleanupStart();
      cleanupEnd();
    }
  }, []);

  useEffect(() => {
    setId(clickedPlan.id)
    setTitle(clickedPlan.title)
    setEventStart(clickedPlan.eventStart)
    setEventEnd(clickedPlan.eventEnd)
    setDescription(clickedPlan.description)
    formatPlanTime(clickedPlan.eventStart, clickedPlan.description)

    // 수정 설정 시간
    setStartEdit(clickedPlan.eventStart)
    setEndEdit(clickedPlan.eventEnd)
    
    if (clickedPlan.eventStart && clickedPlan.eventEnd) {
      let { startTime, endTime, formattedDate } = formatPlanTime(clickedPlan.eventStart, clickedPlan.eventEnd);
      setStartTime(startTime);
      setEndTime(endTime);
      setFormattedDate(formattedDate);
    }

  }, [clickedPlan])

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    if (description !== clickedPlan.description || title !== clickedPlan.title) {
      if (window.confirm('변경 사항이 있습니다. 취소하시겠습니까?')) {
        setIsEditMode(false);
        setDescription(clickedPlan.description || '');
        setTitle(clickedPlan.title || '');
      }
    } else {
      setIsEditMode(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  const setTime = (type, time) => {
    const isStartEdit = type === "startEdit"; 
    const baseDate = new Date(isStartEdit ? startEdit : endEdit);
  
    const [hours, minutes] = time.split(':').map(Number); 
    baseDate.setHours(hours, minutes, 0);
    
    console.log(`${type}(setTime):`, baseDate);
    
    isStartEdit ? setStartEdit(baseDate) : setEndEdit(baseDate);
  };

  const handlePlanUpdate = async () => {
    const data = {
      planName: title,
      planContent: description,
      planTime: startEdit,
      planEnd: endEdit,
      no: id
    };
    try {
      const response = await plan.update(data);
      console.log('planUpdate 응답:', response.data);
    } catch (error) {
      console.error('오류 발생:', error.response ? error.response.data : error.message);
    }
    getDataListByDate(currentDate)
    setIsPlanInfoVisible(false)
  }

  const handlePlanDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?"))
      return;
    try {
      const response = await plan.remove(id);
      console.log('planDelete 응답:', response.data);
    } catch (error) {
      console.error('오류 발생:', error.response ? error.response.data : error.message);
    }
    getDataListByDate(currentDate)
    setIsPlanInfoVisible(false)
  }

  return (
    <div className="pop-up exercise-bymyself">
      <div id="deleteForm" >
        <div className="popup-type">
          <p>자율 운동</p>
          <div className="icons">
            {roles.isUser && (
              <>
                <a id="editIcon" onClick={handleEditClick} ><EditIcon /></a>
                <a id="deleteIcon" onClick={handlePlanDelete}><DeleteIcon /></a>
              </>
            )}
            <a className="exercise-bymyself-close" onClick={onClose}><CloseRoundedIcon /></a>
          </div>
        </div>
      </div>
      <div className={`popup-content ${isEditMode ? 'hidden' : 'edit-before'}`} >
        <div className="popup-title">{title}</div>
        <div className="time-info">
          <p><AccessTimeRoundedIcon /></p>
          <div className="plan-date">
            {formattedDate}
          </div>
          <div className="plan-time">
            <p className="plan-start-time">{startTime}</p>
            <p>-</p>
            <p className="plan-end-time">{endTime}</p>
          </div>
        </div>
        <hr />
        <div className="plan-detail">{description}<br />
        </div>
      </div>
      <div className={`popup-edit ${isEditMode ? '' : 'hidden'}`}>
        <div id="updateForm">
          <div className="popup-title-input">
            <input
             type="text" 
             name="planName" 
             value={title}
             onChange={handleTitleChange}
             />
          </div>
          <div className="set-time">
            <p><AccessTimeRoundedIcon /></p>
            <div className="plan-date">
              {formattedDate}
            </div>
            <div className="set-time-drops">
              <div className="dropdown">
                <button type="button" id="dropdown-edit-start">
                  {startTime}
                  </button>
                <div className="options" id="options-edit-start">
                  {times24Hour.map((time, index) => (
                      <div 
                        key={time}
                        onClick={() => setTime('startEdit', time)}
                      >
                       {times12Hour[index]} 
                      </div>
                  ))}
                </div>
              </div>
              <span>-</span>
              <div className="dropdown">
                <button type="button" id="dropdown-edit-end">
                  {endTime}
                </button>
                <div className="options" id="options-edit-end">
                  {times24Hour.map((time, index) => (
                      <div 
                        key={time}
                        onClick={() => setTime('endEdit', time)}
                      >
                       {times12Hour[index]} 
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <textarea 
            name="planContent" 
            placeholder="내용 입력" 
            value={description}
            onChange={handleDescriptionChange}
            ></textarea>
          <div className="button-container">
            <button type="button" id="cancelButton" onClick={handleCancelClick} >취소</button>
            <button type="submit" id="updateButton" onClick={handlePlanUpdate}>수정</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanInfoModal