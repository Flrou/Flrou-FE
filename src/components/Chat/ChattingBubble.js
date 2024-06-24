import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

import UpdateModal from "../Modal/UpdateModal";
import Character from "../../assets/flrou_character.png";
import { CreatePlanRequest } from "../api/Plan/CreatePlanRequest";

// fadeIn 애니메이션 효과
const fadeIn = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(1.3vh);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 채팅 메시지 컨테이너 스타일
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 80vh; /* 최대 높이 설정 */

  &::-webkit-scrollbar {
    display: none; /* 웹킷 브라우저에서 스크롤바 감추기 */
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러에서 스크롤바 감추기 */
  scrollbar-width: none; /* 파이어폭스에서 스크롤바 감추기 */
`;

// 내 말풍선 스타일
const MyMessageBubble = styled.div`
  display: inline-block;
  max-width: 60%;
  align-self: flex-end;
  background-color: rgba(112, 143, 254, 0.48);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 2.7vh;
  text-align: center;
  color: #2c2c2c;
  font-family: "Pretendard";
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.22px;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

// 상대방 말풍선 컨테이너 스타일
const OpponentMessageContainer = styled.div`
  display: flex;
  height: auto;
  align-items: center;
  flex-direction: row;
`;

// 상대방 말풍선 스타일
const OpponentMessageBubble = styled(MyMessageBubble)`
  max-width: 70%;
  display: inline-block;
  align-items: center;
  margin-top: 2.7vh;
  background-color: #ffffff; /* 배경색 설정 */
  align-self: flex-start; /* 왼쪽 정렬 */
`;

// 캐릭터 이미지 스타일
const CharacterImage = styled.img`
  width: 6vw;
  height: 10vh;
  border-radius: 50%;
  margin-right: 10px;

  @media screen and (max-width: 768px) {
    width: 60px;
  }
`;

const UpdateModalContainer = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 180px;
`;

const ChattingBubble = ({
  messages,
  scheduleMessage,
  todoMessage,
  isCalender,
  isTodo,
  plan,
  isUpdateChatting,
  setIsUpdateChatting,
  setScheduleMessage,
  setTodoMessage,
  setIsCalender,
  setIsTodo,
  setIsButtonDisabled,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [success, setSuccess] = useState(false);
  const id = localStorage.getItem("user_id");
  const messageEndRef = useRef(null);
  const scheduleEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStart = () => {
    scheduleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToStart();
  }, [isCalender, isTodo]);

  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  const isValidNumber = (value) => typeof value === "number" && !isNaN(value);

  const getValidDate = (year, month, day, hour, minute) =>
    new Date(
      isValidNumber(year) ? year : new Date().getFullYear(),
      isValidNumber(month) ? month - 1 : new Date().getMonth(),
      isValidNumber(day) ? day : new Date().getDate(),
      isValidNumber(hour) ? hour : 0,
      isValidNumber(minute) ? minute : 0,
    );

  useEffect(() => {
    if (isCalender && Object.keys(plan).length !== 0) {
      const { s_year, s_month, s_day, s_hour, s_minute, f_year, f_month, f_day, f_hour, f_minute } = plan;

      const startDate = getValidDate(s_year, s_month, s_day, s_hour, s_minute);
      const endDate = getValidDate(f_year, f_month, f_day, f_hour, f_minute);

      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        console.error("Invalid date values in plan:", plan);
        return;
      }

      const updatedPlan = {
        title: plan.plan,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color: plan.color || null,
      };

      setSelectedSchedule(updatedPlan);
      setIsUpdateChatting(true);
    }
  }, [plan, isCalender, setIsUpdateChatting]);

  const handleSave = async (selectedColor, title, notificationInterval) => {
    const colors = [
      "#ff4d6d",
      "#ffb563",
      "#ffe66d",
      "#9ef01a",
      "#72efdd",
      "#4cc9f0",
      "#48bfe3",
      "#3a86ff",
      "#c77dff",
      "#ffc6ff",
      "#ffcfd2",
      "#fde4cf",
      "#fbf8cc",
      "#b9fbc0",
      "#98f5e1",
      "#8eecf5",
      "#90dbf4",
      "#a3c4f3",
      "#cfbaf0",
      "#f1c0e8",
    ];

    const getColorIndexByHashCode = (hashCode, colors) => {
      const index = colors.indexOf(hashCode);
      return index !== -1 ? index : 3; // 기본 색상 인덱스를 3으로 설정
    };

    const s_color = getColorIndexByHashCode(selectedColor, colors);
    const notification = notificationInterval !== null ? notificationInterval : 0;
    try {
      const response = await CreatePlanRequest(
        id,
        plan.plan,
        plan.s_year,
        plan.s_month,
        plan.s_day,
        plan.s_hour,
        plan.s_minute,
        plan.f_year,
        plan.f_month,
        plan.f_day,
        plan.f_hour,
        plan.f_minute,
        notification,
        s_color,
      );

      if (response.data === "success") {
        alert("일정이 등록되었습니다!");
        // 등록 완료 메시지 추가
        setSuccess(true);
        const replyMessage = {
          text: "캘린더에 일정 등록이 완료되었습니다!",
          isMine: false,
        };
        setScheduleMessage((prevScheduleMessages) => [...prevScheduleMessages, replyMessage]);
        setIsCalender(false);
        setIsTodo(false);
        setScheduleMessage([]);
        setTodoMessage([]);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("일정 등록 실패:", error);
    }
  };

  const toggleUpdateModal = () => {
    setIsUpdateChatting(!isUpdateChatting); // 상태 업데이트
  };

  return (
    <>
      <MessageContainer style={{ overflowY: "auto" }}>
        {isCalender && (
          <>
            <OpponentMessageContainer>
              <CharacterImage src={Character} alt="character" />
              <OpponentMessageBubble isMine={false}>{"일정을 말씀해주세요~!"}</OpponentMessageBubble>
            </OpponentMessageContainer>
            {scheduleMessage.map((message, index) =>
              message.isMine ? (
                <MyMessageBubble key={index} isMine={true} textLength={message.text.length}>
                  {message.text}
                </MyMessageBubble>
              ) : (
                <>
                  <OpponentMessageContainer style={{ display: "flex", alignItems: "flex-start" }}>
                    <CharacterImage src={Character} alt="character" />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <OpponentMessageBubble isMine={false}>{message.text}</OpponentMessageBubble>
                      <UpdateModalContainer key={index}>
                        <UpdateModal schedule={selectedSchedule} onClose={toggleUpdateModal} onSave={handleSave} isPopup={false} />
                      </UpdateModalContainer>
                      {success && (
                        <OpponentMessageContainer>
                          <CharacterImage src={Character} alt="character" />
                          <OpponentMessageBubble style={{ marginTop: "20px", left: "-70px" }} isMine={false}>
                            {"일정 등록이 완료되었습니다"}
                          </OpponentMessageBubble>
                        </OpponentMessageContainer>
                      )}
                    </div>
                  </OpponentMessageContainer>
                </>
              ),
            )}
          </>
        )}
        {/* 할 일 메시지 */}
        {isTodo && (
          <>
            <OpponentMessageContainer>
              <CharacterImage src={Character} alt="character" />
              <OpponentMessageBubble isMine={false}>{"오늘의 할일을 말씀해주세요~!"}</OpponentMessageBubble>
            </OpponentMessageContainer>
            {todoMessage.map((message, index) =>
              message.isMine ? (
                <MyMessageBubble key={index} isMine={true} textLength={message.text.length}>
                  {message.text}
                </MyMessageBubble>
              ) : (
                <OpponentMessageContainer key={index}>
                  <CharacterImage src={Character} alt="character" />
                  <OpponentMessageBubble isMine={false}>{`Todo 작성이 완료되었습니다~`}</OpponentMessageBubble>
                </OpponentMessageContainer>
              ),
            )}
          </>
        )}

        {/* 일반 대화 메시지 */}
        {!isCalender &&
          !isTodo &&
          messages.map((message, index) =>
            message.isMine ? (
              <MyMessageBubble key={index} isMine={true} textLength={message.text.length}>
                {message.text}
              </MyMessageBubble>
            ) : (
              <>
                <OpponentMessageContainer key={index}>
                  <CharacterImage src={Character} alt="character" />
                  <OpponentMessageBubble isMine={false}>{message.text}</OpponentMessageBubble>
                </OpponentMessageContainer>
                {isUpdateChatting && (
                  <OpponentMessageContainer key={index}>
                    <CharacterImage src={Character} alt="character" />
                    <OpponentMessageBubble>
                      <UpdateModal
                        style={{ width: "200px" }}
                        key={`modal-${index}`}
                        schedule={plan}
                        onSave={handleSave}
                        onClose={toggleUpdateModal}
                        isPopup={false}
                      />
                    </OpponentMessageBubble>
                  </OpponentMessageContainer>
                )}
              </>
            ),
          )}
        <div ref={messageEndRef} />
        <div ref={scheduleEndRef} />
      </MessageContainer>
    </>
  );
};

ChattingBubble.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  isCalender: PropTypes.bool.isRequired,
  scheduleMessage: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  todoMessage: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  isTodo: PropTypes.bool.isRequired,
  setMessages: PropTypes.func.isRequired,
  setScheduleMessage: PropTypes.func.isRequired,
  setTodoMessage: PropTypes.func.isRequired,
  setIsCalender: PropTypes.func.isRequired,
  setIsTodo: PropTypes.func.isRequired,
  setIsButtonDisabled: PropTypes.func.isRequired,
};

export default ChattingBubble;
