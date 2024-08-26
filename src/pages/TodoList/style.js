import styled from "styled-components";

export const Container = styled.div`
  padding: 0 4vw;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TodoSubject = styled.div`
  width: 100%;
  height: ${(props) => props.isMobile ? '6vh' : '10vh'};
  display: flex;
  align-items: ${(props) => props.isMobile? 'start' : 'center'};
  justify-content: ${(props) => props.isMobile? 'start' : 'center'};
  text-shadow: ${(props) => props.isMobile? '0 2px 2px gray' : '0px 4px 4px gray'};
  font-family: Coiny;
  font-size: ${(props) => props.isMobile ? '24px' : '44px'};
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.28px;
  color: #77ADFD;
  -webkit-text-stroke: ${(props) => props.isMobile ? '1px white' : '3px white'};
`
export const TodoArraow = styled.span`
  cursor: pointer;
  color: ${(col) => { return col.col; }};
  &:hover {
    transform: scale(107%);
  }
`

export const TodoContainer = styled.div`
  width: ${(props) => props.isMobile ? '100%' : '80vh'};
  height: calc(100% - 30vh);
  border-radius: 10px;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
  overflow-y: auto;
  box-sizing: border-box;
`

export const TodoList = styled.div`
  width: 100%;
  height: ${(props) => props.isMobile ? '60px' : '80px'};
  background-color: white;
  border: ${(col) => { return `2px solid ${col.col}`; }};
  border-radius: 12px;
  margin: 0 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex; justify-content: center; align-items: center;

  &:hover {
    box-shadow: 0 2px 8px ${(col) => { return col.col}};
    cursor: pointer;
  }
`

export const TodoContent = styled.div`
  width: calc(100% - 8vh);
  height: 100%;
  font-size: ${(props) => props.isMobile ? '16px' : '20px'};
  display: flex; align-items: center;
  padding: ${(props) => props.isMobile ? '0 20px 0 5px' : '0 20px 0 10px'};
  overflow: hidden;

  input {
    width: 100%; height: 100%;
    margin: 0; padding: 0;
    border: none;
    outline: none;
    font-size: ${(props) => props.isMobile ? '16px' : '20px'};
  }
`

export const TodoButton = styled.div`
  width: 8vh;
  height: 100%;
  display: flex; justify-content: center; align-items: center;

  img {
   width: ${(props) => props.isMobile ? '30px' : '40px'};

   &:hover {
    transform: scale(107%);
   }
  }
`
export const TodoButton2 = styled.div`
    width: 40px;
    display: flex; justify-content: center; align-items: center;
    text-shadow: ${(props) => props.isMobile? '0 2px 2px gray' : '0px 4px 4px gray'};
    font-size: ${(props) => props.isMobile ? '24px' : '34px'};
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    color: ${(col) => { return col.col}};
    -webkit-text-stroke: ${(props) => props.isMobile ? '1px white' : '2px white'};
    font-family: Coiny;

    &:hover {
      transform: scale(107%);
    }
`

export const Line = styled.div`
  width: 100%; height: 5px;
  background-color: lightgray;
  margin: 0 0 20px 0;
  border-radius: 30px;
`