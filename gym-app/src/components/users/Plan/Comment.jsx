import React, { useContext, useEffect, useState } from 'react'
import { useDate } from '../../../contexts/DateContextProvider';
import * as plan from '../../../apis/plan'
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useLocation } from 'react-router-dom';

const Comment = () => {

  const { roles } = useContext(LoginContext)
  const location = useLocation();

  const { currentDate, setCurrentDate, comment, getPlansbyDateUserNo } = useDate();

  const [ccontent, setCcontent] = useState('');
  const [fcontent, setFcontent] = useState('');
  const [commentDate, setCommentDate] = useState('')
  const [isEditMode, setIsEditMode] = useState(false);
  const [no, setNo] = useState(0);

  useEffect(() => {
    // console.dir(comment)
    if (comment){
      setCcontent(comment.ccontent);
      setFcontent(comment.fcontent);
      setNo(comment.no);
      const date = new Date(comment.commentDate);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()} (${date.toLocaleDateString('ko-KR', { weekday: 'short' })})`;
      setCommentDate(formattedDate);
    }

  }, [comment])

  useEffect(() => {
    if (isEditMode) {
      setIsEditMode(false)
    }
  }, [currentDate])
  
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    if(ccontent!== comment.ccontent || fcontent !== comment.fcontent) {
      if (window.confirm('변경 사항이 있습니다. 취소하시겠습니까?')) {
        setIsEditMode(false);
        setCcontent(comment.ccontent || '');
        setFcontent(comment.fcontent || '');
      }
    } else {
      setIsEditMode(false);
    }
  };

  const handleCcontentChange = (e) => {
    setCcontent(e.target.value);
  }
  const handleFcontentChange = (e) => {
    setFcontent(e.target.value);
  }

  const handleInsertComment = async () => {
    const params = new URLSearchParams(location.search);
    const userNo = params.get('userNo');
    // console.log("comment userNo: " + userNo);
    
    const commentDate = new Date(currentDate).setHours(0,0,0,0);
    try {
      const data = {
        ccontent: ccontent,
        fcontent: fcontent,
        userNo: userNo,
        commentDate: commentDate
      }
      // console.log("comment Insert : ", data);
      await plan.insertComment(data)
    } catch (error) {
      console.error('오류 발생:', error.response ? error.response.data : error.message);
    }
    await getPlansbyDateUserNo(currentDate)
    setIsEditMode(false)
  }

  const handleUpdateComment = async () => {
    if(ccontent !== comment.ccontent || fcontent !== comment.fcontent) {
      const params = new URLSearchParams(location.search);
      const userNo = params.get('userNo');
      console.log("comment userNo: " + userNo);

      const commentDate = new Date(currentDate).setHours(0,0,0,0);
      try {
        const data = {
          ccontent: ccontent,
          fcontent: fcontent,
          userNo: userNo,
          commentDate: commentDate,
          no: no
        }
        await plan.updateComment(data);
      } catch (error) {
        console.error('오류 발생:', error.response ? error.response.data : error.message);
      }
    }
    await getPlansbyDateUserNo(currentDate);
    setIsEditMode(false);
  }
  
  return (
    <div className='comment-container pt-4'>
      <div id="updateCommentForm">
        <div className="comment">
          <div className="comment-title">
            <p>trainer's comment</p>
          </div>
          <div className="comment-content">
            <span className="comment-date">{commentDate}</span>
            <input type="hidden" name="commentDate" id='commentDate' />
            <div className={`comment-c comment-detail ${isEditMode ? 'hidden' : ''}`}>
              <span><b>코멘트</b></span><br />
              <span className="cContent">
                {ccontent}  
              </span><br /><br />
              <span><b>식단</b></span><br />
              <span className="fContent">{fcontent}</span>
            </div>
            <div className={`comment-c comment-edit ${isEditMode ? '' : 'hidden'}`}>
              <input type="hidden" name="no" id="commentNo" />
              <input type="hidden" name="userNo" id="userNo" />
              <span><b>코멘트</b></span><br />
              <textarea 
                className="cContent cContent-edit" 
                name="cContent" 
                value={ccontent ?? ''}
                onChange={handleCcontentChange}
              ></textarea><br />
              <span><b>추천 식단</b></span><br />
              <textarea 
                className="fContent fContent-edit" 
                name="fContent"
                value={fcontent ?? ''}
                onChange={handleFcontentChange}
              ></textarea>
            </div>
          </div>
        </div>
        {roles.isTrainer && (
          <div className="comment-btn-container button-container pt-2">
            <button type="button" id="editCommentButton" onClick={handleEditClick} className={`${isEditMode ? 'hidden' : ''}`}>comment 입력</button>
            <div className={`comment-edit ${isEditMode ? '' : 'hidden'}`}>
              <div className="comment-edit-container">
                <button type="button" id="cancelEditComment" onClick={handleCancelClick}>취소</button>
                <button type="submit"  id="updateCommentButton" onClick={handleUpdateComment} className={`${no===0 ? 'hidden' : ''}`} >수정</button>
                <button type="button" id="insertCommentButton" onClick={handleInsertComment} className={`${no===0 ? '' : 'hidden'}`} >저장</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment