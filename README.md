[![Architecture diagram of zak-7869/research-ai-platform](https://gitdiagram.com/zak-7869/research-ai-platform/diagram.png)](https://gitdiagram.com/zak-7869/research-ai-platform?utm_source=readme&utm_medium=picture)


Research AI accepts a topic in its web interface, sends it to the FastAPI research endpoint, searches Tavily for evidence, and uses a Groq model to produce a cited report. The endpoint returns the report and sources for display. The graph separates search from report generation, while the backend also exposes health and Prometheus metrics endpoints. Source excerpts show these runtime links; the repository has no README content, so product scope is based on the supplied source and interface.


<img width="2356" height="5482" alt="diagram" src="https://github.com/user-attachments/assets/0db40bdf-47d4-4904-89eb-0a1f6ac0a6a5" />


