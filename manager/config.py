import json
import os

CONFIG_DIR  = os.path.join(os.environ['APPDATA'], 'MK11KoreanPatch')
CONFIG_PATH = os.path.join(CONFIG_DIR, 'config.json')


class Config:
    def __init__(self):
        self._data = self._load()

    def _load(self):
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def get(self, key, default=None):
        return self._data.get(key, default)

    def set(self, key, value):
        self._data[key] = value
        self._save()

    def _save(self):
        os.makedirs(CONFIG_DIR, exist_ok=True)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)
