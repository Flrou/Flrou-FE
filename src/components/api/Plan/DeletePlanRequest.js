import axios from "axios";

export async function DeletePlanRequest(plan_id) {
  try {
    const requestData = { plan_id };

    const response = await axios.post("https://api.flrou.site/plan/deletePlan", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error("일정 삭제에 실패했습니다.");
  }
}
