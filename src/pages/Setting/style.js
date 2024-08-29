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

export const Center = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 768px) {
    justify-content: center;
    gap: 10px;
  }
`;
