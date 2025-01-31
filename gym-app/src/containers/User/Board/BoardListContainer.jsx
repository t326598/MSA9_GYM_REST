import React, { useEffect, useState } from "react";
import BoardListForm from "../../../components/user/Board/BoardListForm";

const BoardListContainer = () => {
  const [boards, setBoards] = useState([]);
  const [option, setOption] = useState({
    keyword: "",
    rows: 10,
    orderCode: 0,
  });
  const [page, setPage] = useState({
    page: 1,
    rows: 10,
    first: 1,
    last: 1,
    start: 1,
    end: 1,
  });

  const fetchList = async (pageNumber = 1, currentOption = option) => {
    try {
      const response = await fetch(
        `http://192.168.30.63:8080/board?page=${pageNumber}&rows=${currentOption.rows}&keyword=${currentOption.keyword}&orderCode=${currentOption.orderCode}`
      );
      if (response.ok) {
        const { boardList, page: newPage } = await response.json();
        setBoards(boardList);
        setPage(newPage);
        console.log(boardList)

      } else {
        console.error("데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  const handleSearch = (updatedOption = option) => {
    fetchList(1, updatedOption); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (pageNumber) => {
    fetchList(pageNumber);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <BoardListForm
    boards={boards}
      option={option}
      page={page}
      handlePageChange={handlePageChange}
      setOption={setOption}
      onSearch={handleSearch}
    />
  );
};

export default BoardListContainer;
