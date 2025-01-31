import React from 'react'
import { useNavigate } from 'react-router-dom';
import * as Swal from '../../apis/alert.js';
import * as auth from '../../apis/user.js';
import JoinForm from '../../components/user/JoinForm.jsx'

const JoinContainer = () => {

 
        const navigate = useNavigate();
      
        const join = async (form) => {
          try {
            const response = await auth.join(form);
            const status = response.status;
      
            if (status === 200) {
              Swal.alert('회원가입 성공', '로그인 화면으로 이동합니다', 'success', () => {
                navigate('../login');
              });
            } else {
              Swal.alert('회원가입 실패', '회원가입에 실패했습니다.', 'error');
            }
          } catch (error) {
            console.error('회원가입 중 에러가 발생하였습니다.', error);
            Swal.alert('회원가입 실패', '회원가입에 실패했습니다.', 'error');
          }
        };
      
      
        async function checkId() {
          const username = document.getElementById("id").value;
      
          // null 또는 undefined
          if (!username) {
            Swal.alert("아이디를 입력해주세요", '','error');
              return;
          }
      
      
          try {
              // 아이디 중복 확인
              const response = await fetch(`http://192.168.30.63:8080/check/${username}`, {
                  method: 'GET'
              });
              console.log(response);
      
              if (response.ok) {
                  const result = await response.text();
                  let boxId = document.getElementById('box-id');
                  if (result === 'true') {
                    Swal.alert('사용 가능한 아이디입니다.',' ', 'success');
                      boxId.classList.remove('needs-validation');
                      boxId.classList.add('was-validated');
                      return true;
                  } else {
                    Swal.alert('중복된 아이디입니다.', '아이디를 다시 입력해주세요.', 'error');
                      boxId.classList.remove('was-validated');
                      boxId.classList.add('needs-validation');
                  }
                  return false;
              } else {
                Swal.alert('아이디 중복 확인 중 오류가 발생했습니다.', '다시시도해주세요.', 'error');
                  return false;
              }
          } catch (error) {
              console.error('Error:', error);
              Swal.alert('아이디 중복 확인 중 오류가 발생했습니다.', '다시시도해주세요.', 'error');
              return false;
          }
      }
      
  return (
    <JoinForm join={join} checkId={checkId} />
  )
}

export default JoinContainer