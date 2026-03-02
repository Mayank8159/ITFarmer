from typing import Optional

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer
    import torch
except Exception:
    AutoModelForCausalLM = None
    AutoTokenizer = None
    torch = None

class ChatbotService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.chat_history_ids = None

        # Load model lazily and fail open so chat route stays available.
        if AutoModelForCausalLM is None or AutoTokenizer is None:
            return

        try:
            model_name = "microsoft/DialoGPT-medium"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(model_name)
        except Exception:
            self.model = None
            self.tokenizer = None

    def get_reply(self, message: str) -> str:
        if not self.model or not self.tokenizer or torch is None:
            return self._fallback_reply(message)

        # Encode user input
        new_input_ids = self.tokenizer.encode(message + self.tokenizer.eos_token, return_tensors="pt")
        
        # Append previous chat history
        if self.chat_history_ids is not None:
            bot_input_ids = torch.cat([self.chat_history_ids, new_input_ids], dim=-1)
        else:
            bot_input_ids = new_input_ids
        
        # Generate response
        try:
            self.chat_history_ids = self.model.generate(
                bot_input_ids,
                max_length=1000,
                pad_token_id=self.tokenizer.eos_token_id,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.7,
            )
        except Exception:
            return self._fallback_reply(message)
        
        # Decode response
        reply = self.tokenizer.decode(self.chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
        return reply or self._fallback_reply(message)

    def _fallback_reply(self, message: str) -> str:
        lowered = message.lower()

        if "service" in lowered or "what do you do" in lowered:
            return "IT FARM provides software engineering, AI/ML, SaaS builds, security, and UI/UX delivery squads."
        if "contact" in lowered or "email" in lowered:
            return "You can contact the team at team.techserve55@gmail.com."
        if "price" in lowered or "budget" in lowered:
            return "Share your budget and scope in the Services inquiry form, and the team will propose a custom plan."
        if "hello" in lowered or "hi" in lowered:
            return "ORBIT CORE ONLINE. Tell me your project goals and I will guide the next step."

        return "Request acknowledged. For best results, include your use-case, timeline, and budget in the inquiry form."
