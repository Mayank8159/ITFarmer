import json
from tqdm import tqdm
import pandas as pd

def process_stackoverflow_dataset(raw_dataset, max_samples=10000):
    """
    Convert Hugging Face StackOverflow dataset to chatbot-friendly <user, bot> pairs.
    """
    pairs = []
    count = 0

    for item in tqdm(raw_dataset, total=len(raw_dataset)):
        question = item.get("question_title", "") or item.get("question", "")
        answer = item.get("answer_text", "") or item.get("answer", "")

        if question and answer:
            pairs.append({
                "user_message": question.strip(),
                "bot_reply": answer.strip()
            })
            count += 1

        if max_samples and count >= max_samples:
            break

    return pairs

def save_as_json(pairs, path="data/stackoverflow/processed_data.json"):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(pairs, f, indent=2, ensure_ascii=False)

def save_as_csv(pairs, path="data/stackoverflow/processed_data.csv"):
    df = pd.DataFrame(pairs)
    df.to_csv(path, index=False, encoding="utf-8")
