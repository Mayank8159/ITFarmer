from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class ChatbotService:
    def __init__(self):
        # Load your model & tokenizer from Hugging Face
        model_name = "microsoft/DialoGPT-medium"  # can replace with your fine-tuned IT farmer model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.chat_history_ids = None  # keep conversation history

    def get_reply(self, message: str) -> str:
        # Encode user input
        new_input_ids = self.tokenizer.encode(message + self.tokenizer.eos_token, return_tensors="pt")
        
        # Append previous chat history
        if self.chat_history_ids is not None:
            bot_input_ids = torch.cat([self.chat_history_ids, new_input_ids], dim=-1)
        else:
            bot_input_ids = new_input_ids
        
        # Generate response
        self.chat_history_ids = self.model.generate(
            bot_input_ids, max_length=1000, pad_token_id=self.tokenizer.eos_token_id,
            do_sample=True, top_k=50, top_p=0.95, temperature=0.7
        )
        
        # Decode response
        reply = self.tokenizer.decode(self.chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
        return reply
