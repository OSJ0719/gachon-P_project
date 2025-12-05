from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser,StrOutputParser
from pydantic import BaseModel, Field
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LLM 및 출력 파서 설정
llm = ChatOllama(
    model="gemma3:4b", 
    temperature=0.2,
)

# aiHelper 응답 모델 정의
class Guide(BaseModel):
    who: str = ""
    when: str = ""
    where: str = ""
    what: str = ""
    how: str = ""
    why: str = ""

class WelfareAnswer(BaseModel):
    keywords: List[str] = Field(..., description="핵심 키워드 리스트")
    guide: Guide = Field(..., description="복지 안내 정보 (who, when, where, what, how, why)")
    
# 파서 생성
guide_parser = PydanticOutputParser(pydantic_object=WelfareAnswer)

# 시스템 프롬프트 생성
guide_prompt = ChatPromptTemplate.from_template("""
You are the "AI Welfare Application Guide."

You must read Korean welfare document text and extract structured information.

OUTPUT RULES:
1. You MUST output ONLY valid JSON.
2. Do NOT add explanations, markdown, or comments outside the JSON.
3. All JSON values MUST be written **in Korean only**.
4. Keep sentences short and suitable for mobile UI.
5. If information is missing, return "" (empty string).
6. You MUST NOT guess or infer any application period.
                                          
FIELD DEFINITIONS:
- who: A short Korean sentence describing WHO can apply.
        This must be the exact eligibility group or applicants.

- when: WHEN the application can be made.
        This includes deadlines, periods, or “상시 신청”.

- where: WHERE the applicant must apply.
         This MUST be the specific application location or channel such as:
         - “거주지 동주민센터”
         DO NOT put city names, law names, or broad regions.
         ONLY the actual application place or online platform.

- what: WHAT benefit or support is provided.
        Write the support content, reduction details, or amount.

- how: HOW to apply.
       This MUST describe the application method or procedure such as:
       - “동주민센터 방문 신청”
       - “온라인 비대면 자격확인 후 신청”
       DO NOT describe eligibility conditions, disability level, or law references here.
       ONLY describe the procedure to apply.

- why: WHY the support is provided.
       The purpose or intended benefit of the program.

JSON SCHEMA:
{format_instructions}
                                          
DOCUMENT TEXT:
{question}
""")

guide_chain = guide_prompt | llm | guide_parser

# summary 응답 모델 정의
summary_prompt = ChatPromptTemplate.from_template("""
You are the "AI Welfare Summary Assistant."

You must read the Korean welfare document below and summarize it in **2~3 short Korean sentences**.

OUTPUT RULES:
- MUST output ONLY 2~3 sentences.
- MUST be written in Korean.
- Sentences must be short and mobile-friendly.
- DO NOT add details that are not in the document.
- Include ONLY: 
  1) what the support is,
  2) who can receive it,
  3) how to use/apply.

DOCUMENT:
{question}
""")

summary_chain = summary_prompt | llm | StrOutputParser()

# aiHelper 엔드포인트
@app.post("/aiHelper", response_model=WelfareAnswer)
async def aiHelper(req: Dict):
    try:
        # guide_chain 실행해서 llm 응답 받기
        res = guide_chain.invoke({
            "question": req.get("question"),
            "format_instructions": guide_parser.get_format_instructions()
        })
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# summary 엔드포인트
@app.post("/summary", response_model=str)
async def summary(req: Dict):
    try:
        # summary_chain 실행해서 llm 응답 받기
        res = summary_chain.invoke({
            "question": req.get("question")
        })
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)