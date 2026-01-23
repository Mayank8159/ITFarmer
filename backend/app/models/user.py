from pydantic import ConfigDict
from typing import Optional

# Mock Database
users_db = {}

class User:
    def __init__(self, username: str, password_hash: str, full_name: str):
        self.username = username
        self.password_hash = password_hash
        self.full_name = full_name