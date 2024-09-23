import React, { useState, useEffect } from "react";
import moment from "moment";
import Header from "../../layout/Header";
import {
  Container,
  StyledCalendarWrapper,
  StyledCalendar,
  StyledScheduleContainer,
  StyledSchedule,
  StyledScheduleDetail,
  DetailContainer,
} from "./style";

import toggle_on from "../../assets/toggle_on.png";
import toggle_off from "../../assets/toggle_off.png";
import UpdateModal from "../../components/Modal/UpdateModal";
import { GetPlanRequest } from "../../components/api/Plan/GetPlanRequest";
import { UpdatePlanRequest } from "../../components/api/Plan/UpdatePlanRequest";
import { UpdatePlanDone } from "../../components/api/Plan/CompletePlanRequest";
import { DeletePlanRequest } from "../../components/api/Plan/DeletePlanRequest";

import BottomBar from "../../components/Link/BottomMenu";
import useIsMobile from "../../hooks/useIsMobile";
import Background from "../../layout/Background";

const holidays = [
  "2024-01-01", // 신정
  "2024-02-09", // 설날 연휴 시작
  "2024-02-10", // 설날
  "2024-02-11", // 설날 연휴 끝
  "2024-02-12", // 설날 대체공휴일
  "2024-03-01", // 삼일절
  "2024-04-10", // 22대 국회의원 선거
  "2024-05-05", // 어린이날
  "2024-05-06", // 어린이날 대체공휴일
  "2024-05-15", // 부처님오신날
  "2024-06-06", // 현충일
  "2024-08-15", // 광복절
  "2024-09-16", // 추석 연휴
  "2024-09-17", // 추석
  "2024-09-18", // 추석 연휴
  "2024-10-01", // 국군의 날
  "2024-10-03", // 개천절
  "2024-10-09", // 한글날
  "2024-12-25", // 성탄절
];

const Calendar = () => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showCalendarDetails, setShowCalendarDetails] = useState(true); // State to control calendar details visibility
  const id = localStorage.getItem("user_id");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMonth = moment(date);
        const monthsToFetch = 12;
        const requests = [];

        for (let i = -monthsToFetch; i <= monthsToFetch; i++) {
          const month = currentMonth.clone().add(i, "month");
          requests.push(GetPlanRequest(id, month.format("YYYY"), month.format("M")));
        }

        const responses = await Promise.all(requests);

        if (responses.some((response) => !Array.isArray(response))) {
          console.error("데이터가 배열이 아닙니다.");
          return;
        }

        const allSchedules = responses.flat();

        const secondFormatDataArray = allSchedules.map((item) => ({
          id: item.id,
          startDate: new Date(item.s_year, item.s_month - 1, item.s_day, item.s_hour, item.s_minute),
          endDate: new Date(item.f_year, item.f_month - 1, item.f_day, item.f_hour, item.f_minute),
          title: item.plan,
          color: getColorByNumber(item.color),
          isDone: item.isDone,
          alarm: item.alarm,
        }));

        setSchedules(secondFormatDataArray);
        setFilteredSchedules(secondFormatDataArray.filter((schedule) => moment(date).isSame(schedule.startDate, "day")));
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [date]);

  const getColorByNumber = (number) => {
    // 색상 배열
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

    // 숫자를 colors 배열의 길이로 나눈 나머지 값을 색상 배열의 인덱스로 사용
    const index = number % colors.length;

    // 해당 인덱스의 색상 반환
    return colors[index];
  };

  const handleDayClick = (value) => {
    console.log(value);
    const filter_schedules = schedules.filter(
      (schedule) =>
        moment(value).isSame(schedule.startDate, "day") ||
        moment(value).isSame(schedule.endDate, "day") ||
        (moment(value).isAfter(schedule.startDate, "day") && moment(value).isBefore(schedule.endDate, "day")),
    );

    setFilteredSchedules(filter_schedules);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendarDetails(true);
  };

  const handleCompleteToggle = async (scheduleId) => {
    try {
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, isDone: !schedule.isDone } : schedule,
      );
      setSchedules(updatedSchedules);

      const updatedFilteredSchedules = filteredSchedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, isDone: !schedule.isDone } : schedule,
      );
      setFilteredSchedules(updatedFilteredSchedules);

      await UpdatePlanDone(scheduleId);
    } catch (error) {
      console.error("완료 여부를 업데이트하는 중 오류 발생:", error);
    }
  };

  const handlePopup = (schedule) => {
    setSelectedSchedule(schedule);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (selectedSchedule) {
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === selectedSchedule.id ? { ...schedule, isDone: selectedSchedule.isDone } : schedule,
      );
      setSchedules(updatedSchedules);
    }
  };

  const handleDelete = async (id) => {
    try {
      const scheduleId = id;
      await DeletePlanRequest(scheduleId);

      const updatedSchedules = schedules.filter((schedule) => schedule.id !== scheduleId);
      setSchedules(updatedSchedules);

      const updatedFilteredSchedules = filteredSchedules.filter((schedule) => schedule.id !== scheduleId);
      setFilteredSchedules(updatedFilteredSchedules);
    } catch (error) {
      console.error("일정을 삭제하는 중 오류 발생:", error);
    }
  };

  const isHoliday = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const isHoliday = holidays.includes(formattedDate);
    return isHoliday;
  };

  const saveSchedule = async (colorIndex, title, startDate, endDate, notificationInterval) => {
    try {
      const id = selectedSchedule.id;
      const notification = notificationInterval === null ? 15 : notificationInterval;

      await UpdatePlanRequest(
        id,
        title,
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(),
        notification,
        colorIndex,
      );

      setSchedules((prevSchedules) =>
        prevSchedules.map((prevSchedule) =>
          prevSchedule.id === selectedSchedule.id
            ? { ...prevSchedule, title, color: getColorByNumber(colorIndex), startDate, endDate }
            : prevSchedule,
        ),
      );

      setFilteredSchedules((prevFilteredSchedules) =>
        prevFilteredSchedules.map((prevSchedule) =>
          prevSchedule.id === selectedSchedule.id
            ? { ...prevSchedule, title, color: getColorByNumber(colorIndex), startDate, endDate }
            : prevSchedule,
        ),
      );

      setShowPopup(false);
    } catch (error) {
      console.error("일정을 업데이트하는 중 오류 발생:", error);
    }
  };

  return (
    <>
      <Container>
        <Header />
        {!isMobile && <Background />}
        <StyledCalendarWrapper>
          <StyledCalendar
            value={date}
            onChange={handleDateChange}
            formatDay={(locale, date) => moment(date).format("D")}
            formatYear={(locale, date) => moment(date).format("YYYY")}
            formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
            calendarType="gregory"
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              setActiveStartDate(activeStartDate);
              setShowCalendarDetails(false); // Hide details when navigating between months
            }}
            onClickDay={handleDayClick}
            tileClassName={({ date, view }) => {
              const isHolidayDate = isHoliday(date);
              console.log(`Date: ${date}, isHoliday: ${isHolidayDate}`);
              return view === "month" && isHolidayDate ? "holiday" : null;
            }}
            tileContent={({ date }) => {
              const matchingSchedules = schedules.filter((schedule) =>
                moment(date).isBetween(schedule.startDate, schedule.endDate, "day", "[]"),
              );
              return matchingSchedules.map((matchingSchedule, index) => (
                <StyledSchedule
                  color={matchingSchedule.color}
                  key={index}
                  completed={matchingSchedule.isDone}
                  style={{ opacity: matchingSchedule.isDone ? 0.5 : 1 }} // 완료 여부에 따라 투명도 조절
                >
                  {`${matchingSchedule.title}`}
                </StyledSchedule>
              ));
            }}
          />
        </StyledCalendarWrapper>
      </Container>
      {showCalendarDetails && (
        <div style={{ backgroundColor: "#e9f2ff", height: "270px", overflowY: "auto" }}>
          <DetailContainer style={{ marginBottom: isMobile ? "70px" : 0 }}>
            {filteredSchedules.length > 0 && (
              <StyledScheduleContainer style={{ marginBottom: "5px" }}>
                {filteredSchedules.map((schedule, index) => (
                  <StyledScheduleDetail key={index} style={{ opacity: schedule.isDone ? 0.5 : 1 }}>
                    <div style={{ alignItems: "center" }} onClick={() => handlePopup(schedule)}>
                      <span style={{ color: "#A391FF" }}>
                        {`${new Date(schedule.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })} ~ ${new Date(schedule.endDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}`}
                      </span>
                      <span
                        style={{
                          width: isMobile ? "100px" : "200px",
                          marginLeft: isMobile ? "10px" : "50px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        {schedule.title}
                      </span>
                    </div>
                    <img
                      src={schedule.isDone ? toggle_on : toggle_off}
                      alt="토글 활성화"
                      onClick={() => handleCompleteToggle(schedule.id)}
                    />
                  </StyledScheduleDetail>
                ))}
              </StyledScheduleContainer>
            )}
          </DetailContainer>
        </div>
      )}
      {showPopup && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 998,
            }}
            onClick={closePopup}
          />
          <UpdateModal schedule={selectedSchedule} onClose={closePopup} onSave={saveSchedule} isPopup={true} onDelete={handleDelete} />
        </>
      )}
      {isMobile && <BottomBar />}
    </>
  );
};

export default Calendar;
