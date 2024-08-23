import axios from "axios";

export async function CreatePlanRequest(
  user_id,
  plan,
  s_year,
  s_month,
  s_day,
  s_hour,
  s_minute,
  f_year,
  f_month,
  f_day,
  f_hour,
  f_minute,
  alarm,
  color,
) {
  try {
    const requestData = { user_id, plan, s_year, s_month, s_day, s_hour, s_minute, f_year, f_month, f_day, f_hour, f_minute, alarm, color };

    const response = await axios.post("https://api.flrou.site/plan/createPlan", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error("일정 등록에 실패했습니다.");
  }
}
