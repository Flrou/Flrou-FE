import axios from "axios";

export const LoginRequest = async (userId, userPw) => {
  try {
    const response = await axios.post(
      "https://api.flrou.site/user/login",
      {
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
    return response;
  } catch (error) {
    console.error("로그인 에러:", error.message);
    return error;
  }
};
