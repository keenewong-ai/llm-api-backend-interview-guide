# llm-api-backend-interview-guide

Practical interview preparation guide for LLM API Backend roles, structured as individual lessons with explanations, production scenarios, and code examples.

Live site: https://keenewong-ai.github.io/llm-api-backend-interview-guide/

## Lessons

1. 429 Rate Limit
2. Streaming
3. Structured Output
4. RAG
5. Fallback & Routing
6. Caching
7. LLM Gateway

Each lesson has four sections: 面試官真正想問嘅嘢, 生產環境現實, 解決思路, and 現實例子 + code. Completion is saved in the browser (`localStorage`) and the home page shows progress such as `3/7 已完成`.

Extra reference pages (not counted in the 7-lesson progress): Observability & Cost, Security (Prompt Injection), Q&A Cheat Sheet.

## Site

Static site, no build step. GitHub Pages serves the `main` branch root.

- `index.html` — home / lesson list / progress
- `lessons/` — one page per lesson
- `reference/` — optional extra topics
- `style.css`, `script.js`
- Syntax highlighting via highlight.js CDN
