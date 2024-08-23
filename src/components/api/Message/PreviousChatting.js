import axios from "axios";

export async function PreviousChatting() {
  const id = localStorage.getItem("user_id");
  try {
    const response = await axios.get(`https://api.flrou.site/chat/getAllchat/${id}`, {
      withCredentials: true,
    });
    const data = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("이전 대화 내역을 받아오는 것을 실패했습니다.:", error);
  }
}
