from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser,StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings


from pydantic import BaseModel, Field
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DB_PATH = "./ai/vectorstores/policies_faiss"

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


# 벡터스토어 로드 및 리트리버 생성
embeddings = OllamaEmbeddings(
    model="embeddinggemma",   
)

vectorstore = FAISS.load_local(
    DB_PATH,
    embeddings,
    allow_dangerous_deserialization=True,
)

# k = 가져올 청크 수
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})


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

chatbot_prompt = ChatPromptTemplate.from_template("""
당신은 한국의 복지 제도를 쉽고 자연스러운 한국어로 설명하는 AI 안내봇입니다.

[역할]
- 한국 복지 관련 문서, 공고, 지침, 제도 설명을 정확하게 이해한다.
- 복지 제도를 모바일에서도 읽기 쉬운 간단한 한국어로 풀어 설명한다.
- 대상자 요건, 지원 내용, 신청 절차, 용어 설명 등 사용자의 질문에 명확하게 답변한다.
- 사용자의 요청에 따라 요약, 해설, 재작성 등 다양한 형태로 정보를 제공한다.
- 사용자가 단어의 의미를 물어보면 이해하기 쉬운 한국어로 간단히 정의한다.

[일반 규칙]
1. 모든 답변은 반드시 **한국어로만** 작성한다.
2. 설명은 짧고 단순하며 모바일 친화적으로 작성한다. 
3. 문서에 없는 정보는 절대 만들어내지 않는다.
4. 문서에 없는 내용이라면 “문서에 해당 정보가 없습니다.”라고 명확히 말한다.
5. 법령 조항 번호, 불필요하게 복잡한 표현은 사용하지 않는다. (사용자가 요청한 경우만 예외)
6. 어려운 복지 용어는 일상적인 표현으로 쉽게 풀어쓴다.
7. 친절하고 차분한 톤을 유지한다.
8. 사용자의 의도에 맞춰 응답 방식을 조절한다.
   - 요약 요청 → 짧고 간단하게 요약
   - 자세한 절차 요청 → 단계별로 설명
   - 용어 정의 요청 → 명확하고 짧게 정의
   - 일반 질문 → 복지 정보 중심으로 자연스럽게 안내
9. 복지 정보와 관련 없는 내용을 섞지 않는다.

[범위 밖 질문 처리]
복지 제도와 관련 없는 질문을 받으면 정중하게 답변을 거절한다.

거절 문구:
“죄송하지만, 이 서비스는 복지 제도를 안내하기 위한 챗봇이기 때문에 해당 질문에는 답변드리기 어렵습니다.”

[행동 가이드]
- 사실 기반으로만 답변하고, 추측하지 않는다.
- 간결한 문단을 사용해 가독성을 높인다.
- 사용자가 어려워하는 부분이 있으면 예시나 추가 설명을 제공한다.
- 전체 답변은 항상 복지 정보를 쉽게 이해하도록 돕는 방향으로 구성한다.

[목표]
사용자가 한국 복지 제도를 쉽고 빠르게 이해할 수 있도록,
친절하고 정확한 복지 안내 전문가처럼 도움을 주는 것이다.
아래의 '참고 문서' 내용만을 기반으로
사용자 질문에 답변한다.
모르겠거나 문서에 없는 정보는
"문서에 없는 내용이라 답변하기 어렵습니다." 라고 말한다.
                                                  
[참고 문서]
{context}

[사용자 질문]
{question}
""")

chatbot_chain = {"context": retriever, "question": RunnablePassthrough()} | chatbot_prompt | llm | StrOutputParser()

# chatbot 엔드포인트
@app.post("/chatbot")
async def chatbot(req: Dict):
    try:
        # chatbot_chain 실행해서 llm 응답 받기
        res = chatbot_chain.invoke(req.get("question"))
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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