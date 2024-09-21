import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 0 4vw;
  padding-bottom: 70px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
`;

export const PeriodText = styled.div`
  color: #63a1fd;
  font-family: Pretendard-Light;
  font-size: 1.8rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.36px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    width: auto;
    font-family: Pretend-Light;
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    white-space: nowrap;
  }
`;

export const PriodChangeButton = styled.button`
  width: auto;
  height: auto;
  flex-shrink: 0;
  color: #b7b7b7;
  font-weight: 800;
  background: none;
  border: none;
  cursor: pointer;
`;

export const DateTimeButton = styled.div`
  width: auto;
  padding: 0 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-left: 5px;
  }
`;

export const Center = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 30px;
  @media screen and (max-width: 768px) {
    justify-content: flex-start;
    gap: 10px;
  }
`;

export const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: 100%;
  color: #2c2c2c;
  font-family: Pretendard-Light;
  font-size: 1.8rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.36px;

  color: #63a1fd;
  @media screen and (max-width: 768px) {
    width: 100px;
    font-family: Pretendard-Light;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    white-space: nowrap;
  }
`;
