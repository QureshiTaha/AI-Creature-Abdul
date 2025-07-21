# **AI‑Creature: Abdul 🧠💬**

> A self‑hosted, modular AI assistant that blends an open‑source LLM core with emotional intelligence, web‑search super‑powers and a real‑time dashboard.
>
> **Stack →** Python (FastAPI + gguf LLM)  |  Node.js (socket/REST gateway)  |  React (dashboard)

![architecture](https://img.shields.io/badge/stack-Python%20%E2%80%A2%20Node%20%E2%80%A2%20React-blue)
![status](https://img.shields.io/badge/status-alpha-orange)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

---

## ✨ Features

| Layer | Highlights |
|-------|------------|
| **ai‑brain** | • FastAPI micro‑service powered by a local&nbsp;LLM (Mistral 7B in **gguf**)  \  • Streaming & non‑streaming replies  \  • Intent + emotion detection  \  • Built‑in ALU for math  \  • DuckDuckGo web‑search fallback citeturn5view0 |
| **ai‑gate** | • Node.js proxy that exposes clean REST & Socket.IO endpoints  \  • Bridges front‑end ↔ Python and handles CORS & auth  \  • Evolves / fine‑tunes the model on‑demand citeturn9view0turn11view0 |
| **ai‑dashboard** | • React 19 + MUI + Framer‑motion UI  \  • Chat interface with live streaming text  \  • System‑health charts (CPU, GPU, RAM)  \  • Dark / light mode toggle citeturn10view0 |

---

## 🗺️ Architecture

```mermaid
flowchart TD
    subgraph Front‑End
        D["AI Dashboard (React)"]
    end
    subgraph Back‑End
        G["ai‑gate  (Node.js)"]
        B["ai‑brain (FastAPI)"]
    end
    D -- Socket.IO / REST --> G
    G -- HTTP JSON --> B
```

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/QureshiTaha/AI-Creature-Abdul.git
cd AI-Creature-Abdul
```

### 2. Install dependencies
```bash
# ai‑brain (Python)
cd ai-brain
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt  # FastAPI, uvicorn, transformers, torch… citeturn13view0

# ai‑gate (Node.js)
cd ../ai-gate
npm install

# ai‑dashboard (React)
cd ../ai-dashboard
npm install
```

### 3. Run in three terminals (dev mode)
```bash
# Terminal 1 – AI Brain
cd ai-brain
python -m uvicorn main:app --reload

# Terminal 2 – AI Gate
cd ai-gate
npm run serve

# Terminal 3 – Dashboard
cd ai-dashboard
npm start
```
These commands mirror the **`instructions.txt`** shipped with the repo. citeturn4view0

Visit **http://localhost:3000** and start chatting with Abdul.

---

## 🔌 Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_MODEL_PATH` | `engine/mistral-7b-instruct-v0.1.Q4_K_M.gguf` | Local gguf model file used by `ai-brain` |
| `BRAIN_PORT` | `8000` | FastAPI port |
| `GATE_PORT` | `5000` | Node.js gateway port |
| `FRONTEND_PORT` | `3000` | React dev‑server port |
| `OPENAI_API_KEY` | _empty_ | Only required if you switch to an OpenAI‑backed LLM |

Create an **`.env`** file in each service or export them in your shell.

---

## 📚 API Cheatsheet

### ai‑brain (FastAPI)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/think` | Single‑shot answer |
| `POST` | `/think-stream` | Server‑sent event stream for real‑time typing |
| `GET`  | `/evolve` | Trigger Abdul’s evolutionary algorithm |
| `GET`  | `/fine-tune` | Fine‑tune on stored chats |

### ai‑gate (Node)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/brain/ask` | Proxy to `/think` in Python service |
| `GET`  | `/api/brain/evolve` | Proxy to `/evolve` |

_See `ai-gate/routes/brain.js` for details._ citeturn11view0

---

## 📁 Project Structure
```
AI-Creature-Abdul/
├─ ai-brain/         # FastAPI + LLM core
│  ├─ engine/        # Brain, data & trainer modules
│  └─ main.py        # API entry‑point
├─ ai-gate/          # Node.js gateway (REST + Socket.IO)
│  ├─ routes/
│  ├─ sockets/
│  └─ index.js
├─ ai-dashboard/     # React front‑end SPA
│  └─ src/
└─ instructions.txt  # One‑liner quick‑start
```

---

## 🛠 Development Tips
* **Hot‑reload everywhere** – both `uvicorn --reload` and React dev‑server auto‑refresh on change.
* **Large models** – keep your GGUF file outside version control and symlink into `ai-brain/engine/`.
* **GPU vs CPU** – adjust `n_gpu_layers` in `engine/brain.py` for your hardware.
* **Streaming** – use `/think-stream` for minimal latency in the UI.

---

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss major changes.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

---

## 📜 License
Licensed under the **MIT License** – see [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements
* [Mistral‑7B](https://mistral.ai/) for the open‑weights base model.
* [FastAPI](https://fastapi.tiangolo.com/) – the *speed‑of‑light* Python web framework.
* [Socket.IO](https://socket.io/) for effortless real‑time messaging.
* [Material UI](https://mui.com/) & [Framer Motion](https://www.framer.com/motion/) for the sleek dashboard aesthetics.

## ❤️ Inspired by

* OpenAI ChatGPT
* Iron Man’s J.A.R.V.I.S.
* Your curiosity

---

> Crafted with 🧠☕❤️ & late‑night curiosity by **[@QureshiTaha](https://github.com/QureshiTaha)**.

> [**Github**](https://github.com/QureshiTaha/AI-Creature-Abdul) | [**LinkedIn**](https://in.linkedin.com/in/taha-qureshi-full-stack-developer)
