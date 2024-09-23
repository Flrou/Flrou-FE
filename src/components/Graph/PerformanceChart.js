import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area } from "recharts";
import styled from "styled-components";
import character from "../../assets/flrou_character.png";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 997;
  @media (max-width: 768px) {
    height: 80%;
  }
`;

const Modal = styled.div`
  position: fixed;
  font-size: 2rem;
  width: 90%;
  max-width: 600px;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: ${(props) => (props.warning ? "#d9534f" : "black")};
  padding: 20px;
  border-radius: 26px;
  box-shadow: 0px 3px 24px 0px rgba(0, 0, 0, 0.24);
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const Paragraph = styled.p`
  margin: 10px 0;
  font-size: 2rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BlueText = styled.span`
  color: ${(props) => (props.warning ? "#d9534f" : "#63a1fd")};
  font-weight: bold;
`;

const StyledImage = styled.img`
  width: 100px;
  height: auto;
`;

const Text = styled.p`
  margin: 10px 0 20px;
  font-size: 1.5rem;
  line-height: 1.5;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: ${(props) => (props.warning ? "#d9534f" : "#63a1fd")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    background-color: ${(props) => (props.warning ? "#c9302c" : "#5079c6")};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  margin: 0 8px;
  font-size: 1.5rem;
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? (props.warning ? "#c9302c" : "#63a1fd") : props.warning ? "#f5c6c6" : "#ddd")};
  color: ${(props) => (props.active ? "white" : props.warning ? "#d9534f" : "#333")};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? (props.warning ? "#ac2925" : "#5079c6") : props.warning ? "#f1b0b7" : "#ccc")};
  }
`;

const WarningMessage = styled.div`
  margin-bottom: 30px;
  font-size: 1.3rem;
  padding: 15px;
  background-color: ${(props) => (props.warning ? "#ffefef" : "#cce8f4")};
  color: ${(props) => (props.warning ? "#d9534f" : "#66a0da")};
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.8rem;
    margin-bottom: 10px;
  }
`;

const PerformanceChart = ({ isActive, successCount, currentYear, date, user_id, force }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [notificationTime, setNotificationTime] = useState("00:15");
  const [showWarning, setShowWarning] = useState(false);
  const currentDateMonth = new Date();
  const currentDate = currentDateMonth.getMonth() + 1;
  const currentDay = currentDate.getDay();

  useEffect(() => {
    const generateData = () => {
      if (successCount && successCount.length > 0) {
        let newData = [];
        let incompleteRate = 0;

        if (isActive === "month") {
          successCount.forEach((count, index) => {
            const total = count[0] + count[1];
            const completionRate = total === 0 ? 0 : Math.round((count[0] / total) * 100);
            incompleteRate = total === 0 ? 0 : 100 - completionRate;
            newData.push({
              month: `${index + 1}월`,
              완료율: completionRate,
              미완료율: incompleteRate,
            });
          });
        } else {
          let totalSuccess = 0;
          let totalCount = 0;
          successCount.forEach((count) => {
            totalSuccess += count[0];
            totalCount += count[0] + count[1];
          });
          const completionRate = totalCount === 0 ? 0 : Math.round((totalSuccess / totalCount) * 100);
          incompleteRate = totalCount === 0 ? 0 : 100 - completionRate;
          newData.push({
            month: `${currentDate}월`,
            완료율: completionRate,
            미완료율: incompleteRate,
          });
        }

        setData(newData);
        setShowWarning(incompleteRate >= 50);
      }
    };
    generateData();
  }, [isActive, successCount, currentYear, currentDate]);

  const handleSubmit = async () => {
    const id = localStorage.getItem("user_id");
    try {
      const response = await axios.post(
        "https://api.flrou.site/user/setForce",
        {
          user_id: id,
          cur_year: currentYear,
          cur_month: currentDate,
          cur_day: currentDay,
          alarm: notificationTime, // 알림 시간 설정
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(response);
      // 팝업 닫기
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleToggle = (time) => {
    setNotificationTime(time);
  };

  const renderToggleButtons = () => {
    const buttons = [];
    for (let minute = 15; minute < 61; minute += 15) {
      // 15분 간격으로 버튼 생성
      const label = `${minute < 10 ? `0${minute}` : minute}`; // 시간과 분을 포맷팅
      const value = `${minute}`;
      buttons.push(
        <ToggleButton key={label} active={notificationTime === value} warning={showWarning} onClick={() => handleToggle(value)}>
          {label}분 전
        </ToggleButton>,
      );
    }
    return buttons;
  };

  return (
    <div style={{ position: "relative", backgroundColor: "#fff", textAlign: "left", width: "100%", height: "100%" }}>
      {showModal && <Backdrop />}
      {showWarning && (
        <WarningMessage warning={showWarning}>
          ⚠️ 경고: 미완료율이 50% 이상입니다. <br />
          작은 한 걸음이 큰 변화를 만듭니다. 지금 바로 첫 걸음을 내딛어 보세요!
        </WarningMessage>
      )}
      {!showWarning && (
        <WarningMessage warning={showWarning}>
          현재의 일정 관리 상태가 정말 좋습니다! <br />
          지금의 성과를 바탕으로 계속해서 목표를 향해 나아가세요.
        </WarningMessage>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }} style={{ backgroundColor: "transparent" }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip cursor={{ fill: showWarning ? "#ffcccc" : "rgba(207, 239, 255, 0.7)" }} formatter={(value) => `${value}%`} />
          <Legend />
          <Area
            type="monotone"
            dataKey="미완료율"
            stroke={showWarning ? "#d9534f" : "#FF6F6F"}
            fill={showWarning ? "#f8d7da" : "#FF6F6F"}
            fillOpacity={0.3}
            isAnimationActive={false}
            strokeWidth={2}
          />
          <Line type="monotone" dataKey="완료율" stroke="#63a1fd" strokeWidth={3} />
          <Line type="monotone" dataKey="미완료율" stroke={showWarning ? "#d9534f" : "#FF6F6F"} strokeWidth={3} />
          <ReferenceLine
            y={50}
            stroke={showWarning ? "#f8d7da" : "#FFC2C2"}
            strokeWidth={2}
            label={{ value: "50", position: "right", dy: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {showModal && (
        <Modal warning={showWarning}>
          <Paragraph>
            {`${currentDate}월의 일정 완료율이 `}
            <BlueText warning={showWarning}>{data.length > 0 ? `${data[0].완료율}%` : "데이터 없음"}</BlueText>
            {`입니다.`}
          </Paragraph>
          <StyledImage src={character} alt="character" />
          <Text>
            많은 일정에 <BlueText warning={showWarning}>알림</BlueText>을 설정하지 않았어요
            <br />
            오늘부터 <BlueText warning={showWarning}>한 달간</BlueText> 모든 일정에 알림이 설정됩니다.
            <br />
            <BlueText warning={showWarning}>알림 시간</BlueText>을 선택해주세요~
          </Text>
          <ToggleContainer>{renderToggleButtons()}</ToggleContainer>
          <Button warning={showWarning} onClick={handleSubmit}>
            확인
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default PerformanceChart;
