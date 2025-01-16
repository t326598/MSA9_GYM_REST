import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const BoardReadForm = ({ board, answerList, insertA, AnswerDelete, answerUpdate }) => {
  const navigate = useNavigate();
  const { roles } = useContext(LoginContext);

  const [editingAnswerNo, setEditingAnswerNo] = useState(null); // 수정할 답변의 ID
  const [editedContent, setEditedContent] = useState(""); // 수정된 내용
  const [content, setContent] = useState(''); // 답변 입력 상태

  const answerInsert = (e) => {
    e.preventDefault();
    const form = e.target;
    const boardNo = board?.no;
    const content = form.content.value;

    insertA({ boardNo, content });
  };

  const onRemove = () => {
    const check = window.confirm('정말로 삭제하시겠습니까?');
    if (check) AnswerDelete(board.no);
  };

  // 답변 수정 시작
  const startEditing = (answer) => {
    setEditingAnswerNo(answer.no); // 수정할 답변의 ID
    setEditedContent(answer.content); // 기존 내용 로드
  };

  // 답변 수정 제출
  const onSubmit = (e) => {
    e.preventDefault();
  
    const data = {
      content: editedContent,  // 직접 값을 담아서 전송
      no: editingAnswerNo,
    };
  
    // 서버에 POST 요청 (예시: axios 사용)
    answerUpdate(data);
  };
  return (
    <div className="board-read">
      <div className="container">
        <div style={{ textAlign: "left", width: "100%" }}>
          <h1 style={{ textAlign: "left", fontSize: "35px", marginLeft: "220px" }}>
            고객문의 게시판
          </h1>
        </div>

        <div className="border" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <div className="inputbox1">
            <label style={{ color: "black", fontSize: "30px" }}>Q.</label>
            <input
              type="text"
              className="titleinput"
              defaultValue={board.title ?? ''}
              readOnly
              disabled
              style={{
                backgroundColor: "white",
                border: "none",
                fontWeight: "bold",
                color: "black",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <h3 style={{ color: "black", marginRight: "70px", marginBottom: "10px" }}>
              {board.name ?? ''} 회원님
            </h3>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <textarea
              className="textareaInput"
              defaultValue={board.content ?? ''}
              readOnly
              disabled
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "black",
              }}
              rows="5"
              cols="40"
            ></textarea>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "30px" }}>
            <label style={{ color: "black" }}>
              {new Date(board.createdAt).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </label>
          </div>
        </div>

        <div className="btn-box" style={{ width: "880px" }}>
          <button type="button" className="btnInput" onClick={() => navigate("/boardList")}>
            목록
          </button>
          <button
            type="button"
            className="btnInput"
            style={{ backgroundColor: "rgb(172, 235, 77)" }}
            onClick={() => navigate(`/boardUpdate/${board.no}`)}
          >
            수정
          </button>
        </div>

        {/* 답변 섹션 */}
        <div className="answer-section">
          <h2>트레이너 답변</h2>
          {answerList.length > 0 ? (
            // 답변 목록 표시
            <div id="answer-list">
              {answerList.map((answer) => (
                <div key={answer.no} className="answer-box">
                  <div className="border" style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <div className="inputbox1">
                      <label style={{ color: "black", fontSize: "30px" }}>A.</label>
                      <input
                        type="text"
                        className="titleinput"
                        defaultValue={board.title ?? ""}
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "white",
                          border: "none",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <h3 style={{ color: "black", marginRight: "70px", marginBottom: "10px" }}>
                        {answer?.name ?? ""} 트레이너
                      </h3>
                    </div>

                    {/* 수정 상태에 따라 다르게 렌더링 */}
                    {editingAnswerNo === answer.no ? (
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <textarea
                          className="textareaInput"
                          name="answercontent"
                          id="answercontent"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)} // 수정된 내용 반영
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "black",
                          }}
                          rows="5"
                          cols="40"
                        ></textarea>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <textarea
                          className="textareaInput"
                          defaultValue={answer?.content ?? ""}
                          readOnly
                          disabled
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "black",
                          }}
                          rows="5"
                          cols="40"
                        ></textarea>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "30px" }}>
                      <label style={{ color: "black" }}>
                        {new Date(answer?.createdAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </label>
                    </div>

                    {/* 수정 및 삭제 버튼 */}
                    {(roles.isAdmin || roles.isTrainer) && (
                      <div style={{ marginTop: "10px" }}>
                        {editingAnswerNo === answer.no ? (
                          <>
                            <button
                              className="btnInput"
                              style={{ marginRight: "10px", backgroundColor: "rgb(77, 235, 123)" }}
                              onClick={onSubmit}
                            >
                              저장
                            </button>
                            <button
                              className="btnInput"
                              style={{ backgroundColor: "rgb(235, 77, 77)" }}
                              onClick={() => setEditingAnswerNo(null)} // 수정 취소
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btnInput"
                              style={{ marginRight: "10px", backgroundColor: "rgb(235, 173, 77)" }}
                              onClick={() => startEditing(answer)} // 수정 시작
                            >
                              수정
                            </button>
                            <button
                              className="btnInput"
                              style={{ backgroundColor: "rgb(235, 77, 77)" }}
                              onClick={() => onRemove(answer.no)} // 삭제
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : roles.isAdmin ? (
            <div className="border" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <form onSubmit={answerInsert}>
                <div className="inputbox1">
                  <label style={{ color: "black", fontSize: "30px" }}>A.</label>
                  <input
                    type="text"
                    className="titleinput"
                    defaultValue={board.title ?? ''}
                    readOnly
                    disabled
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <textarea
                    name="content"
                    id="content"
                    className="textareaInput"
                    required
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                    }}
                    rows="5"
                    cols="40"
                    value={content}  // 상태 값을 사용
                    onChange={(e) => setContent(e.target.value)} // 상태 관리
                  ></textarea>
                </div>
                <button className="btnInput" type="submit">
                  답변 등록
                </button>
              </form>
            </div>
          ) : (
            <p>트레이너의 답변을 기다려주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardReadForm;
