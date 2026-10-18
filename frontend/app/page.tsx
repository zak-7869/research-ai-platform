"use client";
import { FormEvent, useState } from "react";
type Source = {title:string;url:string;content?:string};
type Result = {topic:string;report:string;sources:Source[]};
export default function Home() {
 const [topic,setTopic]=useState(""); const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault();setError("");setResult(null);setLoading(true);
  try {
   const base=(process.env.NEXT_PUBLIC_API_BASE_URL||"http://localhost:8000").replace(/\/$/,"");
   const res=await fetch(`${base}/api/research`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic})});
   const data=await res.json(); if(!res.ok) throw new Error(data.detail||`Request failed (${res.status})`); setResult(data);
  } catch(e) {setError(e instanceof Error?e.message:"Unexpected error");} finally {setLoading(false);}
 }
 return <main className="shell">
  <header className="topbar"><div className="brand">R</div><b>Research AI</b><span className="topnote">WEB RESEARCH STUDIO</span></header>
  <section className="hero"><div className="eyebrow">● AI-POWERED RESEARCH</div><h1>Turn questions into<br/><em>clear insights.</em></h1>
  <p className="intro">Research the web, connect the dots, and get a structured report with source links.</p>
  <form className="search" onSubmit={submit}><label htmlFor="topic">What would you like to research?</label>
   <textarea id="topic" value={topic} onChange={e=>setTopic(e.target.value)} minLength={3} maxLength={500} required placeholder="e.g. How is generative AI changing healthcare?"/>
   <div className="bottom"><small>↗ Web sources included · Up to 500 characters</small><button disabled={loading||topic.trim().length<3}>{loading?"Researching…":"Generate report →"}</button></div>
  </form>
  {loading&&<p className="notice">Searching the web and generating your report. This can take a little while.</p>}
  {error&&<div className="error" role="alert"><b>Research failed</b><p>{error}</p><small>Check backend status and Groq/Tavily API keys.</small></div>}
  </section>
  {result&&<section className="results"><div className="resulthead"><div><div className="eyebrow">YOUR RESEARCH REPORT</div><h2>{result.topic}</h2></div><button className="secondary" onClick={()=>navigator.clipboard.writeText(result.report)}>Copy report</button></div>
   <article className="report"><pre>{result.report}</pre></article><h3>Sources ({result.sources?.length||0})</h3>
   <div className="sources">{result.sources?.map((s,i)=><a className="source" href={s.url} target="_blank" rel="noreferrer" key={`${s.url}-${i}`}><span>{String(i+1).padStart(2,"0")}</span><div><b>{s.title}</b><small>{s.url}</small></div>↗</a>)}</div>
  </section>}
  <footer><span>Research AI · LangGraph + Groq + Tavily</span><span>Verify important claims with original sources.</span></footer>
 </main>;
}
