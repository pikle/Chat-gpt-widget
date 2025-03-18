# Chat Widget with GPT Assistant

Этот проект представляет полностью рабочий чат-виджет с GPT-ассистентом, построенный на:

- **Frontend:** React (TypeScript) с Socket.IO-клиентом.
- **Backend:** NestJS (TypeScript) с WebSocket, интеграцией OpenAI API, PostgreSQL через TypeORM.
- **Инфраструктура:** Docker, Docker Compose, CI/CD (на основе GitHub Actions).

## Структура проекта

chat-widget-gpt/ 
├── docker-compose.yml 
├── .env 
├── .gitignore 
├── README.md 
├── backend/ 
│ 
├── Dockerfile 
│ 
├── .env 
│ 
├── package.json 
│ 
├── tsconfig.json 
│ 
└── src/ 
│ 
├── main.ts 
│ 
├── app.module.ts 
│ 
├── chat/ 
│ 
│ 
├── chat.gateway.ts 
│ 
│ 
├── chat.service.ts 
│ 
│ 
└── chat.module.ts 
│ 
├── openai/ 
│ 
│ 
└── openai.service.ts 
│ 
├── message/ 
│ 
│ 
└── message.entity.ts 
│ 
├── upload/ 
│ 
│ 
└── file.controller.ts 
│ 
└── history/ 
│ 
└── history.controller.ts 
└── frontend/ 
├── Dockerfile 
├── .env 
├── package.json 
├── tsconfig.json 
├── vite.config.ts 
├── index.html 
└── src/ 
├── main.tsx 
├── App.tsx
├── socket.ts 
├── components/ 
│ 
├── ChatWidget.tsx 
│ 
├── ChatWindow.tsx 
│ 
└── MessageInput.tsx 
└── styles/ 
└── global.css