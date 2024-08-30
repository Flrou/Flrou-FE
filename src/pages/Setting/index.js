import React from "react";
import Header from "../../layout/Header";
import Background from "../../layout/Background";
import BottomBar from "../../components/Link/BottomMenu";
import useIsMobile from "../../hooks/useIsMobile";
import { Container } from "./style";
import { Center } from "./style";
import Character from "../../assets/flrou_character.png";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Background />
      <Container>
        <Header />
        <Center>
          <img src={Character} alt={"character"} />
          준비중인 페이지입니다.
        </Center>
        {isMobile && <BottomBar />} {/* 하단 바 추가 */}
      </Container>
    </>
  );
};

export default Index;
