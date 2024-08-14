import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "../../layout/Header";
import Background from "../../layout/Background";
import { Container, TodoButton, TodoButton2, TodoContainer, TodoContent, TodoList, TodoSubject, Line } from "./style";
// import { Container, TodoArraow, TodoButton, TodoButton2, TodoContainer, TodoContent, TodoList, TodoSubject } from "./style";

import btn1 from "../../assets/todo_btn_1.png";
import btn2 from "../../assets/todo_btn_2.png";

import useIsMobile from "../../hooks/useIsMobile";
import BottomBar from "../../components/Link/BottomMenu";

const Index = () => {
  const user_id = localStorage.getItem("user_id");
  const isMobile = useIsMobile();

  // 투두 리스트
  const [todoListActivate, setTodoListActivate] = useState(null);
  const [todoListNonActivate, setTodoListNonActivate] = useState(null);
  // 리스트 클릭 여부
  const [clicked, setClicked] = useState(false);
  // 투두 수정본
  const [newTodo, setNewTodo] = useState(null);


  // 전체 투두리스트 불러오기
  const getTodo = async () => {
    const res = await axios.get(`http://localhost:3000/todo/getAllTodo/${user_id}`);
    console.log(res.data.activate);
    console.log(res.data.nonActivate);
    setTodoListActivate(res.data.activate);
    setTodoListNonActivate(res.data.nonActivate);
  }

  // 버튼 클릭 시 (isDone true<->false)
  const handleTodoBtn = async (list) => {
    try {
      const res = await axios.post("http://localhost:3000/todo/updateTodoDone", {
        todo_id: list.id
      })
      // console.log(res);
      getTodo();
    } catch (error) {
      console.log(error);
    }

  }

  // 리스트 클릭시 (수정/삭제 요청)
  const clickContent = async (list) => {
    // 팝업 띄우기?
    // console.log(list.todo);
    setClicked(!clicked);
    // console.log(clicked);
  }

  // 수정 버튼 클릭시
  const clickV = async (list) => {
    if(!newTodo) setClicked(false);
    if(newTodo) {
      await axios.post("http://localhost:3000/todo/updateTodo", {
        todo_id: list.id,
        new_todo: newTodo
      })
      setClicked(false);
      getTodo();
    }
  }

  // 삭제 버튼 클릭시
  const clickX = async (list) => {
    if(confirm("삭제하시겠습니까?")) {
      await axios.post("http://localhost:3000/todo/deleteTodo", {
        todo_id: list.id,
      })
      getTodo();
    }else {
      setClicked(false);
    }
  }

  useEffect(() => {
    getTodo();
  }, [])

  // useEffect(() => {
  //   console.log(newTodo)
  // }, [newTodo])


  // 최종 발표 ver
  return (
    <>
      {!isMobile && <Background />}
      <Container>
        <Header />
        <TodoSubject isMobile={isMobile}>
          <div>Todo List</div>
        </TodoSubject>

        <TodoContainer isMobile={isMobile}>
        {/* 미완료 탭 */}
        {todoListActivate && todoListActivate.map((list) => {
          let color = '#77ADFD';
          return(
            <>
            <TodoList isMobile={isMobile} key={list.id} col={color} onClick={() => {clickContent(list)}}>
              {clicked ? (
                <>
                <TodoContent isMobile={isMobile}>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder={list.todo}
                  />
                </TodoContent>
                <TodoButton isMobile={isMobile} onClick={(e) => {e.stopPropagation()}}>
                  <TodoButton2 isMobile={isMobile} col={'#77ADFD'} onClick={() => {clickV(list)}}>V</TodoButton2>
                  <TodoButton2 isMobile={isMobile} col={'red'} onClick={() => {clickX(list)}}>X</TodoButton2>
                </TodoButton>
                </>
              ) : (
                <>
                <TodoContent isMobile={isMobile}>{list.todo}</TodoContent>
                <TodoButton isMobile={isMobile}>
                  <img src={btn1} onClick={(e) => {
                    e.stopPropagation();
                    handleTodoBtn(list);
                  }}></img>
                </TodoButton>
                </>
              )}
            </TodoList>
            </>
          )})}

        {todoListActivate && todoListNonActivate && todoListActivate.length > 0 && todoListNonActivate.length > 0 &&
          <Line />
        }

        {/* 완료 탭 */}
        {todoListNonActivate && todoListNonActivate.map((list) => {
          let color = 'lightgray';
          return(
            <>
            <TodoList isMobile={isMobile} key={list.id} col={color} onClick={() => {clickContent(list)}}>
              {clicked ? (
                <>
                <TodoContent isMobile={isMobile}>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder={list.todo}
                  />
                </TodoContent>
                <TodoButton isMobile={isMobile} onClick={(e) => {e.stopPropagation()}}>
                  <TodoButton2 isMobile={isMobile} col={'#77ADFD'} onClick={() => {clickV(list)}}>V</TodoButton2>
                  <TodoButton2 isMobile={isMobile} col={'red'} onClick={() => {clickX(list)}}>X</TodoButton2>
                </TodoButton>
                </>
              ) : (
                <>
                  <TodoContent isMobile={isMobile}>{list.todo}</TodoContent>
                  <TodoButton isMobile={isMobile}>
                    <img src={btn2} onClick={(e) => {
                      e.stopPropagation();
                      handleTodoBtn(list);
                    }}></img>
                  </TodoButton>
                </>
              )}
            </TodoList>
            </>
          )})}

        </TodoContainer>

        {isMobile && <BottomBar />}
      </Container>
    </>
  );

  // 최종 점검 ver.
  // return (
  //   <Container>
  //     <Header />
  //     <TodoSubject>
  //       {finished ? (
  //         <>
  //         <TodoArraow onClick={() => {setFinished(true)}} col={'lightgray'}
  //         >{'<'}</TodoArraow>
  //         <div>Todo List</div>
  //         <TodoArraow onClick={() => {
  //           setFinished(false);
  //           setClicked(false);
  //         }}>{'>'}</TodoArraow>
  //         </>
  //       ) : (
  //         <>
  //         <TodoArraow onClick={() => {
  //           setFinished(true);
  //           setClicked(false);
  //         }}>{'<'}</TodoArraow>
  //         <div>Todo List</div>
  //         <TodoArraow onClick={() => {setFinished(false)}} col={'lightgray'}>{'>'}</TodoArraow>
  //         </>
  //       )}
  //     </TodoSubject>

  //     {todoList &&
  //     <TodoContainer>
  //       {todoList.filter((list0) => finished ? list0.isDone : !list0.isDone).map((list) => {
  //         let color = '#77ADFD'
  //         if(finished) {
  //           color = 'lightgray';
  //         }else if(!finished) {
  //           color = '#77ADFD';
  //         }

  //         return(
  //           <>
  //           <TodoList key={list.id} col={color} onClick={() => {clickContent(list)}}>
  //             {clicked ? (
  //               <>
  //               <TodoContent>
  //                 <input
  //                   onClick={(e) => e.stopPropagation()}
  //                   onChange={(e) => setNewTodo(e.target.value)}
  //                   placeholder={list.todo}
  //                 />
  //               </TodoContent>
  //               <TodoButton onClick={(e) => {e.stopPropagation()}}>
  //                 <TodoButton2 col={'#77ADFD'} onClick={() => {clickV(list)}}>V</TodoButton2>
  //                 <TodoButton2 col={'red'} onClick={() => {clickX(list)}}>X</TodoButton2>
  //               </TodoButton>
  //               </>
  //             ) : (
  //               <>
  //               <TodoContent>{list.todo}</TodoContent>
  //               <TodoButton>
  //                 {finished ? (
  //                   <img src={btn2} onClick={(e) => {
  //                     e.stopPropagation();
  //                     handleTodoBtn(list);
  //                   }}></img>
  //                 ) : (
  //                   <img src={btn1} onClick={(e) => {
  //                     e.stopPropagation();
  //                     handleTodoBtn(list);
  //                   }}></img>                  )}
  //               </TodoButton>
  //               </>
  //             )}
  //           </TodoList>
  //         </>
  //         )
  //       })}
  //     </TodoContainer>
  //     }
  //   </Container>
  // );
};

export default Index;
