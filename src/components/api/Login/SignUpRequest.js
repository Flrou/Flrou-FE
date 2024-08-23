import axios from "axios";

export const SignUpRequest = async (nickName, userId, userPw) => {
  try {
    const response = await axios.post(
      "http://183.96.249.59:12521/user/signup",
      {
        nickname: nickName,
        user_id: userId,
        user_pw: userPw,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      // 서버가 응답을 반환했으나 2xx 범위가 아닌 상태 코드
      console.error("서버 에러:", error.response.data);
    } else if (error.request) {
      // 요청이 이루어졌으나 서버로부터 응답이 없었음
      console.error("서버로부터 응답이 없음:", error.request);
    } else {
      // 요청을 설정하는 동안 오류가 발생
      console.error("요청 설정 에러:", error.message);
    }
    return error;
  }
};
