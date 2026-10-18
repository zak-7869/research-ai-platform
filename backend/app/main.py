import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from prometheus_fastapi_instrumentator import Instrumentator
from app.graph import build_graph

load_dotenv()
graph = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global graph
    graph = build_graph()
    yield

app = FastAPI(title="Research AI API", version="1.0.0", lifespan=lifespan)
origins = [x.strip() for x in os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False,
                   allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])
Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)

class ResearchRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=500)

@app.get("/")
def root():
    return {"service": "Research AI API", "docs": "/docs", "health": "/health"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/research")
async def research(req: ResearchRequest):
    if graph is None:
        raise HTTPException(503, "Research graph is not ready")
    try:
        result = await graph.ainvoke({"topic": req.topic.strip()})
        return {"topic": req.topic.strip(), "report": result.get("report", ""),
                "sources": result.get("search_results", [])}
    except Exception as exc:
        print(f"Research failed: {type(exc).__name__}: {exc}")
        raise HTTPException(502, "Research failed. Check API keys, provider status, and backend logs.") from exc
