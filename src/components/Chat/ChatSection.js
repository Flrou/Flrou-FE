import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import SendButton from "../../assets/send_button.svg";
const InputContainer = styled.div`
  display: flex; /* 내부 요소들을 수평으로 정렬하기 위해 추가 */
  justify-content: center;
  align-items: center;
  height: 6vh;
`;

const StyledInput = styled.input`
  width: calc(100% - 60px);
  height: 100%;
  border-radius: 15px;
  border: 4px solid #83b5ff;
  background: #fff;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.15);
  padding-right: 30px;
  padding-left: 30px;
  color: #4e4d4d;
  font-family: Pretendard-Light;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  outline: none;

  @media screen and (max-width: 768px) {
    height: auto;
    padding-top: 3px;
    padding-bottom: 3px;
    /* margin-bottom: 100px; */
    font-size: 18px;
  }
`;

const SendIcon = styled.img`
  /* display: flex; */
  /* align-items: center; */
  /* margin-bottom: 100px; */
  margin-left: 10px;
  width: 3vw;
  height: 100%;

  cursor: pointer;

  &:hover {
    content: auto;
    transform: scale(103%);
  }
  @media screen and (max-width: 768px) {
    width: 30px;
    /* margin-top: 10px; */
  }
`;

const ChatInput = ({ onSendMessage, isAccess }) => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // 전송 버튼이 활성화되어 있을 때만 메시지를 전송하도록 조건 추가
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <InputContainer>
      <StyledInput
        type="text"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={handleMessageChange}
        onKeyPress={(e) => {
          // 엔터 키를 눌렀을 때 메시지 전송 기능이 비활성화되어 있으면 동작하지 않도록 수정
          if (e.key === "Enter" && !isAccess) {
            handleSendMessage();
          }
        }}
      />
      <SendIcon src={SendButton} alt="send button" onClick={handleSendMessage} />
    </InputContainer>
  );
};

export default ChatInput;
