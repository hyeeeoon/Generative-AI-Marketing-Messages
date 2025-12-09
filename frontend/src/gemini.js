const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGeminiAPI(customer, formFilters) {
  const { event, purpose, tone, channel, extra } = formFilters;

  // 1) 프롬프트 
  const prompt = `
당신은 한국 통신사 마케팅 문구를 작성하는 카피라이터입니다.

[고객 정보]
- 고객ID: ${customer.id}
- 요금제: ${customer.plan || "정보 없음"}
- 월 청구금액: ${customer.price}원
- 사용 기간: ${customer.period}
- 성별: ${customer.gender}
- 해지 위험군 여부: ${customer.risk ? "위험군" : "일반"}

[캠페인/발송 정보]
- 이벤트: ${event}
- 목적: ${purpose}
- 발송 채널: ${channel}
- 톤앤매너: ${tone}
- 추가로 꼭 포함해야 할 문구(가능하면 자연스럽게 녹이기): ${extra || "없음"}

[작성 규칙]
- 한국어로 작성하세요.
- ${channel}에 적합한 길이와 말투로 작성하세요.
- 첫 문장은 고객에게 인사와 이벤트 소개를 함께 포함하세요.
- 해지 위험군(risk=true) 고객인 경우, "지금 해지 고민 중이시라면" 같이 붙잡는 느낌을 살짝 넣어주세요.
- 문장 전체를 하나의 마케팅 메시지 본문으로만 출력하세요.
- 불필요한 설명이나 따옴표, 마크다운, JSON 없이 순수 본문만 출력하세요.
`;

  const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      GEMINI_API_KEY;

    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (res.status === 429) {
        const waitMs = (2 ** attempt) * 1000;
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "메시지 생성에 실패했습니다.";
      return text;
    }

    return "요청이 너무 많아 잠시 후 다시 시도해주세요.";
}