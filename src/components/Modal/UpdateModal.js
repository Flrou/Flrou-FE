import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import detail_arrow from "../../assets/detail_arrow.png";
import detail_close_arrow from "../../assets/detail_close_arrow.png";
import "./DatePicker.css";
import useIsMobile from "../../hooks/useIsMobile";

const UpdateModal = ({ schedule, onClose, onSave, onDelete, isPopup }) => {
  if (!schedule) return null;
  console.log(schedule);

  const [title, setTitle] = useState(schedule.title);
  const [selectedColor, setSelectedColor] = useState(schedule.color);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(schedule.startDate));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date(schedule.endDate));
  const [notificationInterval, setNotificationInterval] = useState(null);
  const [alarm, setAlarm] = useState(schedule.alarm);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 400);
  const isMobile768 = useIsMobile();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 400);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTitle(schedule.title);
    setSelectedColor(schedule.color);
    setSelectedStartDate(new Date(schedule.startDate));
    setSelectedEndDate(new Date(schedule.endDate));
    setAlarm(schedule.alarm);
  }, [schedule]);

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

  const fontSize = isMobile ? (isPopup ? "15px " : "15px") : "16px";

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    // alignItems: isPopup ? "center" : "",
    // justifyContent: isPopup ? "center" : "",
    borderRadius: "10px",
    background: "#fff",
    zIndex: 999,
    width: "50vw",
    height: "auto",
    position: isPopup ? "fixed" : "absolute",
    top: isPopup ? "50%" : "0%",
    left: isPopup ? "50%" : "0%",
    transform: isPopup ? "translate(-50%, -50%)" : "-",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    gap: "10px",
    fontSize: fontSize,
  };

  const buttonStyle = {
    borderRadius: "10px",
    border: "1px solid #84B3FA",
    background: "#FFF",
    fontWeight: "500",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    padding: isMobile ? "5px 10px" : "10px 20px",
    cursor: "pointer",
    fontSize: fontSize,
  };

  const saveButtonStyle = {
    ...buttonStyle,
    background: "#84B3FA",
    color: "#FFF",
    marginRight: isMobile ? "10px" : "30px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    background: "#FD6A6A",
    color: "#FFF",
    marginRight: isMobile ? "10px" : "30px",
  };

  const closeBtnStyle = {
    ...buttonStyle,
    background: "#ccc",
    color: "#fff",
    marginRight: "0px",
  };

  const TitleContainer = {
    ...buttonStyle,
    fontSize: fontSize,
    fontWeight: "500",
    padding: "7px",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  };

  const ColorContainer = {
    ...buttonStyle,
    fontSize: fontSize,
    marginBottom: "0px",
    paddingRight: "4px",
  };

  const colorButtonStyle = (color) => ({
    width: isMobile768 ? "20px" : "30px",
    height: isMobile768 ? "20px" : "30px",
    borderRadius: "50%",
    border: `2px solid ${color === selectedColor ? "#1d2d44" : "#fff"}`,
    background: color,
    cursor: "pointer",
    margin: isMobile768 ? "5px" : "8px",
    pointerEvents: color === selectedColor ? "none" : "auto", // 클릭된 색상은 다시 클릭되지 않도록 설정
  });

  const handleColorSelect = (color) => {
    setSelectedColor(color === selectedColor ? "" : color); // 같은 색상 버튼을 다시 클릭하면 선택 해제
    setDropdownOpen(false);
  };

  const handleNotificationIntervalChange = (event) => {
    setNotificationInterval(parseInt(event.target.value));
  };

  const getColorIndexByHashCode = (hashCode, colors) => {
    // 해시코드가 배열에 포함되어 있는지 확인
    const index = colors.indexOf(hashCode);

    // 포함되어 있다면 인덱스 반환, 아니면 0 (default color) 반환
    return index !== -1 ? index : 0;
  };

  const handleSave = () => {
    const s_color = getColorIndexByHashCode(selectedColor, colors);
    onSave(s_color, title, selectedStartDate, selectedEndDate, notificationInterval);
  };

  const handleDeleteClick = async () => {
    console.log(schedule.id);
    onDelete(schedule.id);
    onClose();
  };

  return (
    <div style={containerStyle}>
      {isPopup && <h2 style={{ color: "#708FFE", margin: "0 0 20px 0" }}>Update</h2>}
      <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "10px" }}>
        <p style={{ width: "36%", margin: "0" }}>일정명:</p>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={TitleContainer} placeholder="일정명" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "10px" }}>
          <p style={{ width: "30%", margin: "0" }}>시작 일시:</p>
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            dateFormat="yyyy-MM-dd HH:mm"
            selectsStart
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            showTimeInput
            style={{ width: "70%", padding: "5px", fontSize: "16px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "10px" }}>
          <p style={{ width: "30%", margin: "0" }}>종료 일시:</p>
          <DatePicker
            selected={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            dateFormat="yyyy-MM-dd HH:mm"
            selectsEnd
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            minDate={selectedStartDate}
            showTimeInput
            style={{ width: "70%", padding: "5px", fontSize: "16px" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ width: "30%", margin: "0" }}>색상명:</p>
        <div style={{ display: "flex", position: "relative", textAlign: "left", width: "70%" }}>
          <button
            style={{
              ...ColorContainer,
              background: selectedColor || "#FFF",
              padding: "7px",
              fontSize: "16px",
              width: "100%",
              marginBottom: "0px",
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            색상 선택
            <img src={dropdownOpen ? detail_close_arrow : detail_arrow} style={{ marginLeft: "10px", width: "10px" }} alt="자세히 보기" />
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                left: "0",
                backgroundColor: "#fff",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                padding: isMobile768 ? "2px" : "5px",
                zIndex: 999,
                width: isMobile768 ? "150px" : "200px",
                height: "auto",
                overflowY: "auto", // Y축 스크롤을 자동으로 생성
                overflow: "scroll",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {colors.map((color) => (
                <div key={color} style={colorButtonStyle(color)} onClick={() => handleColorSelect(color)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? "10px" : "20px" }}>
        <p style={{ width: "30%", margin: "0" }}>알림 설정:</p>
        <select
          value={alarm}
          onChange={handleNotificationIntervalChange}
          style={{ ...ColorContainer, width: "70%", padding: "7px", fontSize: "15px" }}
        >
          <option value={0}>알림 없음</option>
          <option value={15}>15분</option>
          <option value={30}>30분</option>
          <option value={45}>45분</option>
          <option value={60}>1시간</option>
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: isMobile ? "10px" : "20px" }}>
        <button style={saveButtonStyle} onClick={handleSave}>
          저장
        </button>
        {isPopup && (
          <button style={deleteButtonStyle} onClick={handleDeleteClick}>
            삭제
          </button>
        )}
        <button style={closeBtnStyle} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

UpdateModal.propTypes = {
  schedule: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isPopup: PropTypes.bool,
};

export default UpdateModal;
