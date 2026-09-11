from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Dict, List
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # exchange_id -> List[WebSocket]
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, exchange_id: str, websocket: WebSocket):
        await websocket.accept()
        if exchange_id not in self.active_connections:
            self.active_connections[exchange_id] = []
        self.active_connections[exchange_id].append(websocket)

    def disconnect(self, exchange_id: str, websocket: WebSocket):
        if exchange_id in self.active_connections:
            if websocket in self.active_connections[exchange_id]:
                self.active_connections[exchange_id].remove(websocket)
            if not self.active_connections[exchange_id]:
                del self.active_connections[exchange_id]

    async def broadcast_to_exchange(self, exchange_id: str, message: dict):
        if exchange_id in self.active_connections:
            payload = json.dumps(message)
            for connection in self.active_connections[exchange_id]:
                await connection.send_text(payload)

manager = ConnectionManager()

@router.websocket("/ws/exchange/{exchange_id}")
async def exchange_websocket(websocket: WebSocket, exchange_id: str, user_id: str = Query("anonymous")):
    await manager.connect(exchange_id, websocket)
    try:
        # Notify room of peer joining
        await manager.broadcast_to_exchange(exchange_id, {
            "type": "USER_JOINED",
            "userId": user_id,
            "message": f"Peer {user_id} joined the exchange session workspace."
        })

        while True:
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                # Broadcast real-time message or milestone event
                await manager.broadcast_to_exchange(exchange_id, {
                    "type": parsed.get("type", "CHAT_MESSAGE"),
                    "senderId": user_id,
                    "content": parsed.get("content", ""),
                    "timestamp": parsed.get("timestamp", "")
                })
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(exchange_id, websocket)
        await manager.broadcast_to_exchange(exchange_id, {
            "type": "USER_LEFT",
            "userId": user_id,
            "message": f"Peer {user_id} disconnected."
        })
