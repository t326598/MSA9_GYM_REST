import React, { useState, useEffect, useContext } from 'react';
import './Ranking.css'; 
import { LoginContext } from '../../../contexts/LoginContextProvider';
import Header from '../../../components/header/header';
import Footer from '../../../components/Footer/footer';

function Ranking() {
   const { isLoading, isLogin, roles, userInfo } = useContext(LoginContext);
   const [rankingList, setRankingList] = useState([]); // 랭킹 목록 상태
   const [userId, setUserId] = useState(null); // 로그인된 사용자 ID 상태

   // 컴포넌트가 마운트될 때 데이터 가져오기
   useEffect(() => {
     // 서버로부터 랭킹 데이터를 받아오는 로직
     const fetchRankingData = async () => {
       try {
         const response = await fetch('http://192.168.30.63:8080/ranking');
         if (response.ok) {
           const data = await response.json(); // JSON 응답을 파싱
           console.log('userInfo : ', userInfo?.id);
           console.log('rankingList : ', data);
           setUserId(userInfo?.id); // 로그인된 사용자 ID로 설정
           setRankingList(data); // 랭킹 데이터를 상태에 저장
         } else {
           console.error('Failed to fetch ranking data');
         }
       } catch (error) {
         console.error('Error fetching ranking data:', error);
       }
     };

     fetchRankingData();
   }, [userInfo]); // userInfo가 변경될 때마다 실행

   // 나의 랭킹으로 이동하는 함수
   const goToMyRanking = () => {
     console.log('Button clicked');
     
     if (!isLogin) {
       alert('로그인이 필요한 기능입니다.');
       return;
     }

     const targetRank = document.getElementById(`rank-${userInfo.id}`);
     if (!targetRank) {
       alert('출석 정보가 존재하지 않습니다.');
       return;
     }

     // 스크롤 동작
     targetRank.scrollIntoView({
       behavior: 'smooth',
       block: 'center'
     });

     // 하이라이트 효과 적용
     targetRank.classList.add('highlight');
     setTimeout(() => {
       targetRank.classList.remove('highlight');
     }, 2000); // 2초 후 하이라이트 제거
   };

   return (
     <><div className="oswRanking">
       <Header />
       <div className="fullBody">
         <div className="main">
           <div className="content1">
             {/* 로그인 여부와 관계없이 나의 랭킹 이동 버튼을 활성화 */}
             <button
               id="my-ranking-btn"
               className="btn-primary"
               onClick={goToMyRanking}
             >
               나의 랭킹으로 이동
             </button>
           </div>

           <div className="content2">
             <div className="text">
               <h1 style={{ marginLeft: '-35px', padding: '30px' }}>출석 랭킹</h1>
             </div>

             <div className="table-container">
               <table className="attendance-table" style={{ fontSize: 'large', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr>
                     <th><br /><br />랭킹</th>
                     <th><br /><br />회원ID</th>
                     <th><br /><br />출석횟수</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rankingList.map(rank => (
                     <tr key={rank.userId} id={`rank-${rank.userId}`}>
                       <td>
                         {rank.rank === 1 && (
                           <img src="images/gold.png" alt="" className="ranking-icon" />
                         )}
                         {rank.rank === 2 && (
                           <img src="images/silver.png" alt="" className="ranking-icon" />
                         )}
                         {rank.rank === 3 && (
                           <img src="images/bronze.png" alt="" className="ranking-icon" />
                         )}
                         {rank.rank > 3 && <span>{rank.rank}</span>}
                       </td>
                       <td>{rank.userId}</td>
                       <td>{rank.attendanceCount}회</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           <div className="content3">
             <button id="my-ranking-btn" className="btn-primary2" disabled>
               1등 : 이용권 1달 무료 + PT 5회<br /><br />
               2등 : 이용권 1달 무료<br /><br />
               3등 : 이용권 50% 할인
             </button>
           </div>
         </div>



         <script>
           {/* 공통 스크립트 추가 */}
         </script>
       </div>
     </div>
     <Footer />
     </>
   );
}

export default Ranking;
