import axios from "axios";

export async function UpdatePlanDone(plan_id) {
  try {
    const requestData = { plan_id };

    const response = await axios.post("https://api.flrou.site/plan/updatePlanDone", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error("일정 완수 등록에 실패했습니다.");
  }
}
