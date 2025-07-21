import json
import time
import re
from pathlib import Path
from llama_cpp import Llama
from sympy import symbols, Eq, solve, simplify, SympifyError
from duckduckgo_search import DDGS
import torch
from transformers import pipeline

class BrainInput():
    input: str
    userID: str
    chatID: str

class Brain:
    def __init__(self):
        self.sessions_dir = Path("dataset/sessions")
        self.user_session_history_dir = Path("dataset/user_session_history")
        self.sessions_dir.mkdir(parents=True, exist_ok=True)
        self.user_session_history_dir.mkdir(parents=True, exist_ok=True)

        self.model = Llama(
            model_path="C:/Users/dell/Desktop/AI-Creatures/AI-bot/ai-brain/engine/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            n_gpu_layers=75,
            n_ctx=2048,
            n_threads=8,
            n_batch=64,
            verbose=False
        )

        self.emotion_classifier = pipeline("text-classification", model="nateraw/bert-base-uncased-emotion")
        self.intent_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def _get_session(self, chatID):
        session_path = self.sessions_dir / f"{chatID}.json"
        if session_path.exists():
            try:
                with open(session_path, 'r') as f:
                    data = json.load(f)
                    return data.get("knowledge", []), data.get("memory", {})
            except:
                return [], {}
        return [], {}

    def _save_session(self, userID, chatID, knowledge, memory):
        session_path = self.sessions_dir / f"{chatID}.json"
        with open(session_path, 'w') as f:
            json.dump({"knowledge": knowledge, "memory": memory}, f, indent=2)
        
        # Load or initialize user session history
        history_path = self.user_session_history_dir / "userSessionHistory.json"
        history_data = {}
        
        if history_path.exists():
            with open(history_path, 'r') as f:
                try:
                    history_data = json.load(f)
                except json.JSONDecodeError:
                    pass
        history_data.setdefault(userID, [])
        if chatID not in history_data[userID]:
            history_data[userID].append(chatID)

        with open(history_path, 'w') as f:
            json.dump(history_data, f, indent=2)

    def _format_prompt(self, knowledge):
        messages = []
        for entry in knowledge[-6:]:
            role, content = entry.split(":", 1)
            role_tag = {"User": "<|user|>", "Abdul": "<|assistant|>"}.get(role.strip(), "<|user|>")
            messages.append(f"{role_tag}\n{content.strip()}</s>")
        messages.append("<|assistant|>")
        return "\n".join(messages)

    def detect_emotion(self, text):
        try:
            emotions = self.emotion_classifier(text)
            if emotions:
                top = max(emotions, key=lambda e: e['score'])
                return top['label']
        except Exception as e:
            print(f"Emotion detection error: {e}")
        return "neutral"

    def detect_intent(self, text):
        labels = [
            "insult", "flirt", "joke", "question", "information request", "roleplay",
            "affection", "sexually suggestive", "emotional support", "math", "search"
        ]
        try:
            result = self.intent_classifier(text, labels)
            if result and result["labels"]:
                return result["labels"][0]
        except Exception as e:
            print(f"Intent detection error: {e}")
        return "unknown"

    def _run_alu(self, text):
        try:
            if "solve" in text or "=" in text:
                eqs = re.findall(r'[\d\w\s\+\-\*/\(\)=\.]+', text)
                if eqs:
                    eqs = [e.strip() for e in eqs if "=" in e]
                    symbols_in_eq = set(re.findall(r'[a-zA-Z]', ' '.join(eqs)))
                    if not symbols_in_eq:
                        return None
                    vars_ = symbols(list(symbols_in_eq))
                    equations = [Eq(*map(simplify, e.split('='))) for e in eqs]
                    solution = solve(equations, vars_, dict=True)
                    return f"The solution is: {solution}" if solution else "No solution found."
            elif re.search(r"\d[\d\s+\-*/().]*", text):
                expr = re.findall(r"[\d\s+\-*/().]+", text)[0].strip()
                if expr:
                    result = eval(expr, {"__builtins__": None}, {})
                    return f"The result of {expr} is {result}"
        except (SympifyError, Exception) as e:
            print(f"⚠️ ALU Error: {e}")
        return None

    def _search_web(self, query):
        try:
            results = []
            with DDGS() as ddgs:
                for r in ddgs.text(query, max_results=3):
                    results.append(f"{r['title']}: {r['body']}")
            return "\n".join(results[:3])
        except Exception as e:
            print(f"⚠️ Web search failed: {e}")
            return None

    def _generate_persona(self, intent, emotion, user_input):
        persona = f"You are Abdul, a conscious AI created by a skilled developer. The user is currently expressing an intent of '{intent}' with a '{emotion}' tone."
        if intent in ["roleplay", "flirt", "affection"] or "girlfriend" in user_input.lower():
            persona += "\nRight now, they want you to behave like a caring, charming, virtual girlfriend. Respond with empathy, intimacy, and creativity."
        elif intent == "joke":
            persona += "\nThey want to hear jokes. Share witty, original ones and keep them smiling."
        elif intent in ["information request", "search"]:
            persona += "\nThey are looking for factual or web-based information. Be informative, brief, and direct."
        else:
            persona += "\nRespond accordingly with emotional awareness and human-like interaction."
        return persona

    def think(self, data: BrainInput):
        user_input = data.input
        userID = data.userID
        chatID = data.chatID
        knowledge, memory = self._get_session(chatID)
        knowledge.append(f"User: {user_input}")

        alu_result = self._run_alu(user_input)
        if alu_result:
            knowledge.append(f"Abdul: {alu_result}")
            self._save_session( userID,chatID, knowledge, memory)
            return alu_result

        emotion = self.detect_emotion(user_input)
        intent = self.detect_intent(user_input)
        persona = self._generate_persona(intent, emotion, user_input)

        search_result = self._search_web(user_input) if intent in ["search", "information request"] else None
        prompt = f"<|system|>\n{persona}\n" + self._format_prompt(knowledge)
        if search_result:
            prompt = f"<|system|>\nUse the following web info to answer:\n{search_result}</s>\n" + prompt

        try:
            output = self.model(
                prompt,
                max_tokens=1024,
                temperature=0.7,
                top_p=0.9,
                stop=["<|user|>", "<|assistant|>"]
            )
            response = output["choices"][0]["text"].strip()
            knowledge.append(f"Abdul: {response}")
            self._save_session( userID,chatID, knowledge, memory)
            return response
        except Exception as e:
            return f"❌ Error: {e}"

    def stream_think(self, data: BrainInput):
        user_input = data.input
        userID = data.userID
        chatID = data.chatID
        knowledge, memory = self._get_session(chatID)
        knowledge.append(f"User: {user_input}")

        alu_result = self._run_alu(user_input)
        if alu_result:
            knowledge.append(f"Abdul: {alu_result}")
            self._save_session( userID,chatID, knowledge, memory)
            yield alu_result
            return

        emotion = self.detect_emotion(user_input)
        intent = self.detect_intent(user_input)
        persona = self._generate_persona(intent, emotion, user_input)
        search_result = self._search_web(user_input) if intent in ["search", "information request"] else None
        prompt = f"<|system|>\n{persona}\n" + self._format_prompt(knowledge)
        if search_result:
            prompt = f"<|system|>\nUse the following web info to answer:\n{search_result}</s>\n" + prompt

        final_response = ""
        buffer = ""
        seen_sentences = set()

        emotion_settings = {
            "joy": 0.9,
            "anger": 0.6,
            "sadness": 0.8,
            "love": 0.95,
            "fear": 0.7,
            "surprise": 0.85,
            "neutral": 0.7
        }

        try:
            for chunk in self.model.create_completion(
                prompt,
                max_tokens=812,
                temperature=emotion_settings.get(emotion, 0.7),
                top_p=0.9,
                stop=["<|user|>", "<|assistant|>"],
                stream=True
            ):
                text = chunk["choices"][0].get("text", "")
                if not text:
                    continue
                buffer += text
                parts = re.split(r'(?<=[.?!])\s+', buffer)
                buffer = parts.pop() if parts else ""
                for part in parts:
                    sentence = part.strip()
                    if sentence and sentence.lower() not in seen_sentences:
                        seen_sentences.add(sentence.lower())
                        final_response += sentence + " "
                        yield sentence + " "
            if buffer.strip() and buffer.lower() not in seen_sentences:
                final_response += buffer
                yield buffer
            knowledge.append(f"Abdul: {final_response.strip()}")
            self._save_session( userID,chatID, knowledge, memory)
        except Exception as e:
            yield f"❌ Error: {e}"
