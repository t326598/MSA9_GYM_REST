import React, { useContext, useEffect, useState } from 'react'
import PlanContent from '../../components/users/Plan/PlanContent'
import PlanInsertModal from '../../components/users/Plan/PlanInsertModal'
import PlanInfoModal from '../../components/users/Plan/PlanInfoModal'
import RsvInfoModal from '../../components/users/Plan/RsvInfoModal'
import * as plan from '../../apis/plan'
import { useDate } from "../../contexts/DateContextProvider";
import { LoginContext } from '../../contexts/LoginContextProvider'
import * as Swal from '../../apis/alert'
import { useNavigate } from 'react-router-dom'

const PlanContainer = () => {

  const { roles, autoLogin, isLoading } = useContext(LoginContext)
  
  const { currentDate, setCurrentDate, comment, planList, rsvList, getDataList, getPlansbyUserNo,
    isPlanInsertVisible, setIsPlanInsertVisible,
    isPlanInfoVisible, setIsPlanInfoVisible, 
    isRsvInfoVisible, setIsRsvInfoVisible } = useDate();

  const navigate = useNavigate();

  // const [comment, setComment] = useState();
  // const [planList, setPlanList] = useState([]);
  // const [rsvList, setRsvList] = useState([]);

  const [times24Hour, setTimes24Hour] = useState([]);
  const [times12Hour, setTimes12Hour] = useState([]);

  

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
          // console.log("PlanContainer roles isUser: " + roles.isUser);
          if(userNo === null) {
            await getDataList();
          } else {
            Swal.alert('접근할 수 없습니다.', '접근할 권한이 없습니다.', 'warning', () => {
                      navigate('/');
                    });
          }
        } else if(roles.isTrainer) {
          if(userNo != null) {
            await getPlansbyUserNo();
          } else {
            Swal.alert('접근할 수 없습니다.', '회원번호가 필요합니다.', 'warning', () => {
              navigate('/');
            });
          }
        }
        const { times24Hour, times12Hour } = generateTimeLists();
        setTimes24Hour(times24Hour);
        setTimes12Hour(times12Hour);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.alert('접근 불가', '접근 가능 권한이 아닙니다.', 'warning', () => {
            navigate('/');
          });
        } else {
          console.error(error);
        }
      }
      
    };

    fetchData();
  }, [roles.isUser, roles.isTrainer])
  
  const generateTimeLists = () => {
    const times24Hour = [];
    const times12Hour = [];
    
    for (let i = 6; i <= 22; i++) {
      for (let j = 0; j < 60; j += 15) {
        const time24 = `${String(i).padStart(2, '0')}:${String(j).padStart(2, '0')}`;
        times24Hour.push(time24);
  
        const hours12 = i % 12 || 12;
        const meridiem = i >= 12 ? '오후' : '오전';
        const time12 = `${meridiem} ${hours12}:${String(j).padStart(2, '0')}`;
        times12Hour.push(time12);
      }
    }
  
    return { times24Hour, times12Hour };
  };

  const setupDropdown = (buttonId, optionsId) => {
    const dropdownButton = document.getElementById(buttonId);
    const options = document.getElementById(optionsId);

    const toggleOptions = () => {
      options.style.display = options.style.display === "block" ? "none" : "block";
    };
    
    const handleOptionClick = (event) => {
      if (event.target.tagName === "DIV") {
        dropdownButton.textContent = event.target.textContent;
        options.style.display = "none"; // 옵션 숨기기
      }
    };
    
    const handleDocumentClick = (event) => {
      if (!event.target.closest(`#${buttonId}`) && !event.target.closest(`#${optionsId}`)) {
        options.style.display = "none";
      }
    };

    // 드롭다운 버튼 클릭 시 옵션 표시/숨김
    dropdownButton.addEventListener("click", toggleOptions);
    // 옵션 클릭 시 버튼에 값 표시
    options.addEventListener("click", handleOptionClick);
    // 외부 클릭 시 옵션 숨기기
    document.addEventListener("click", handleDocumentClick);
    
    return () => {
      dropdownButton.removeEventListener("click", toggleOptions);
      options.removeEventListener("click", handleOptionClick);
      document.removeEventListener("click", handleDocumentClick);
    };
  }

  const handleClosePlanInsert = () => {
    setIsPlanInsertVisible(false);
  };
  const handleClosePlanInfo = () => {
    setIsPlanInfoVisible(false);
  };
  const handleCloseRsvInfo = () => {
    setIsRsvInfoVisible(false);
  };

  return (
    <div className='schedule' style={{"overflowX": "hidden", "paddingTop": "80px"}}>
      <PlanContent
        comment={comment} planList={planList} rsvList={rsvList} />
      {isPlanInsertVisible && <PlanInsertModal 
        times24Hour={times24Hour} times12Hour={times12Hour} setupDropdown={setupDropdown} onClose={handleClosePlanInsert} />}
      {isPlanInfoVisible && <PlanInfoModal 
        times24Hour={times24Hour} times12Hour={times12Hour} setupDropdown={setupDropdown}
        planList={planList} onClose={handleClosePlanInfo} />}
      {isRsvInfoVisible && <RsvInfoModal rsvList={rsvList} onClose={handleCloseRsvInfo} />}
    </div>
  )
}

export default PlanContainer