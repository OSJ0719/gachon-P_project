import json
from pathlib import Path
import os

from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings


JSONL_PATH = "./ai/policy_corpus.jsonl" 
DB_PATH = "vectorstores/policies_faiss"  

def load_policies_as_docs(path: str):
    docs = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            obj = json.loads(line)
            policy_id = obj.get("policy_id")
            text = obj.get("text", "")

            docs.append(
                Document(
                    page_content=text,
                    metadata={"policy_id": policy_id}
                )
            )
    return docs

def build_vectorstore():
    docs = load_policies_as_docs(JSONL_PATH)
    print("정책 개수:", len(docs))

    embeddings = OllamaEmbeddings(
        model="embeddinggemma",   
    )

    vectorstore = FAISS.from_documents(docs, embeddings)
    Path(DB_PATH).mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(DB_PATH)
    print("저장 완료:", DB_PATH)

build_vectorstore()