from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter(prefix="/notifications")

# Connected admin clients
active_connections: List[WebSocket] = []

@router.websocket("/admin")
async def admin_notifications(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# Helper to notify all connected admins
async def notify_admins(message: dict):
    disconnected = []
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except:
            disconnected.append(connection)
    for conn in disconnected:
        active_connections.remove(conn)
