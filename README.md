# llm-api-backend-interview-guide

Practical interview preparation guide for LLM API Backend roles, structured as individual lessons with explanations, production scenarios, and code examples.

Live site: https://keenewong-ai.github.io/llm-api-backend-interview-guide/

## Lessons

- L01 — 429 Rate Limit
- L02 — Streaming
- L03 — Structured Output
- L04 — RAG
- L05 — Fallback & Routing
- L06 — Caching
- L07 — LLM Gateway

Each lesson has four sections: 面試官真正想問嘅嘢, 生產環境現實, 解決思路, and 現實例子 + code. Completion is saved in the browser (`localStorage`) and the home page shows progress such as `3/7 已完成`.

Extra reference pages (not counted in the 7-lesson progress):

- L08 — Observability & Cost
- L09 — Security (Prompt Injection)
- L10 — Q&A Cheat Sheet

## Site

Static site, no build step. GitHub Pages serves the `main` branch root.

- `index.html` — home / lesson list / progress
- `lessons/` — one page per lesson
- `reference/` — optional extra topics
- `style.css`, `script.js`
- Syntax highlighting via highlight.js CDN
