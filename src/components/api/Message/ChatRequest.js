import axios from "axios";

export async function ChatRequest(user_id, content, mode, isUser) {
  try {
    const requestData = {
      user_id: user_id,
      content: content,
      mode: mode,
      isUser: isUser,
    };

    const response = await axios.post("https://api.flrou.site/chat/send", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error("채팅 요청에 실패했습니다.");
  }
}
