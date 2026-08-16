# 📚 Quiz Generator (Frontend-Only)

A fully client-side quiz platform built with **React**. It reads a **structured PDF** containing questions and answers, parses it directly in the browser, and generates an interactive quiz — no backend, no AI agent, and no external API calls. All quiz progress and results are saved using **localStorage**.

---

## ✨ Features

- 📄 **PDF-based question source** — upload a PDF formatted with questions and answers; the app parses it locally in the browser.
- ⚛️ **Pure React frontend** — no server, no database, no backend API.
- 🚫 **No AI involved** — parsing relies on a defined structural/text pattern in the PDF, not language models.
- 💾 **LocalStorage persistence** — quiz sets, progress, and scores persist across sessions without any server.
- 🎯 **Self-contained quiz engine** — question navigation, answer selection, scoring, and review are all handled client-side.
- 🔁 **Reusable/replayable quizzes** — parsed question sets are stored locally and can be replayed anytime without re-uploading the PDF.

---

## 🏗️ Tech Stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| UI Framework     | React (Vite or CRA)                                   |
| PDF Parsing      | `pdf.js` / `pdfjs-dist` (client-side text extraction) |
| State Management | React state / Context API                             |
| Storage          | Browser `localStorage`                                |
| Styling          | CSS / Tailwind (optional)                             |
| Hosting          | Static hosting (Vercel, Netlify, GitHub Pages)        |

> No backend server, database, or third-party AI/LLM API is used anywhere in this project.

---

## 📁 Project Structure

```
quiz-generator/
├── public/
├── src/
│   ├── components/
│   │   ├── PdfUploader.jsx        # Handles PDF file input
│   │   ├── QuizPlayer.jsx         # Renders questions and handles answering logic
│   │   ├── ResultSummary.jsx      # Displays score and review
│   │   └── QuizList.jsx           # Lists saved quizzes from localStorage
│   ├── utils/
│   │   ├── pdfParser.js           # Extracts text from PDF and structures Q&A
│   │   ├── quizParserRules.js     # Regex/pattern rules for identifying Q/A/Options
│   │   └── storage.js             # localStorage get/set/remove helpers
│   ├── context/
│   │   └── QuizContext.jsx        # Shared quiz state across components
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

---

## 📄 Expected PDF Structure

The parser looks for a consistent, predictable text pattern in the PDF. Example format:

```
Q1. What is the capital of France?
A) Berlin
B) Madrid
C) Paris
D) Rome
Answer: C

Q2. Which language runs in a web browser?
A) Python
B) JavaScript
C) C++
D) Java
Answer: B
```

**Parsing rules (customizable in `quizParserRules.js`):**

- Questions must start with `Q<number>.`
- Options must be prefixed with `A)`, `B)`, `C)`, `D)`
- The correct answer must be marked with `Answer:` followed by the option letter

> If your PDF follows a different structure, update the regex patterns in `src/utils/quizParserRules.js` to match your format.

---

## ⚙️ How It Works

1. **Upload** — User uploads a PDF via `PdfUploader`.
2. **Extract** — `pdf.js` extracts raw text content from the PDF, page by page.
3. **Parse** — `pdfParser.js` applies structural rules (`quizParserRules.js`) to convert raw text into a structured array of question objects:
   ```js
   {
     id: 1,
     question: "What is the capital of France?",
     options: ["Berlin", "Madrid", "Paris", "Rome"],
     answer: "C"
   }
   ```
4. **Store** — The parsed quiz set is saved to `localStorage` under a unique quiz key.
5. **Play** — `QuizPlayer` reads the quiz set, renders one question at a time, tracks selected answers, and computes the score — entirely in-browser.
6. **Review** — `ResultSummary` shows correct/incorrect answers and final score, also cached in `localStorage` for later review.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd quiz-generator
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

The build output is fully static and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.) since there is no backend dependency.

---

## 🗄️ LocalStorage Schema

| Key                  | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `quiz_<id>`          | Stores the parsed question/answer set for a given quiz |
| `quiz_progress_<id>` | Stores current answer selections mid-quiz              |
| `quiz_results_<id>`  | Stores final score and answer review after completion  |
| `quiz_list`          | Index of all saved quizzes (id, title, date created)   |

---

## 🔒 Privacy & Offline Behavior

- All PDF parsing happens **locally in the browser** — files are never uploaded to a server.
- All quiz data is stored **only on the user's device** via `localStorage`.
- The app works **fully offline** after the initial page load (if bundled as a PWA or served statically).

---

## 🛣️ Roadmap Ideas

- [ ] Support multiple question formats (True/False, fill-in-the-blank)
- [ ] Export/import quiz sets as JSON
- [ ] Timer-based quiz mode
- [ ] Dark mode
- [ ] IndexedDB fallback for larger question banks

---

## 📝 License

MIT License — free to use, modify, and distribute.
