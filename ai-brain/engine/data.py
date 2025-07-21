import json
from pathlib import Path

class DataCollection:
    def __init__(self):
        self.sessions_dir = Path("dataset/sessions")
        self.user_session_history_dir = Path("dataset/user_session_history")
        self.sessions_dir.mkdir(parents=True, exist_ok=True)
        self.user_session_history_dir.mkdir(parents=True, exist_ok=True)
        
    def getSessionDataByChatID(self, chatID):
        print(f"Getting data collection for chatID: {chatID}")
        session_path = self.sessions_dir / f"{chatID}.json"
        if session_path.exists():
            try:
                with open(session_path, 'r') as f:
                    data = json.load(f)
                    return data.get("knowledge", []), data.get("memory", {})
            except:
                return [], {}
        return [], {}
    
    def getUserSessionHistoryByUserID(self, userID):
        print(f"Getting data collection for userID: {userID}")
        history_path = self.user_session_history_dir / "userSessionHistory.json"
        history_data = {}   
        if history_path.exists():
            try:
                with open(history_path, 'r') as f:
                    history_data = json.load(f)
                    return history_data.get(userID, [])
            except json.JSONDecodeError:
                print(f"Error reading JSON data from {history_path}")
        return []
