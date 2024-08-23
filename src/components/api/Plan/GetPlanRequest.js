import axios from "axios";

export async function GetPlanRequest(userId, year, month) {
  try {
    const response = await axios.get(`https://api.flrou.site/plan/getPlanByMonth/${userId}/${year}/${month}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("일정 수신에 실패했습니다.");
  }
}
