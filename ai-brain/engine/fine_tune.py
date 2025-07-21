import os
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, BitsAndBytesConfig
from trl import SFTTrainer
from huggingface_hub import login
from peft import LoraConfig, get_peft_model

# ✅ Required if offloading layers
os.environ["ACCELERATE_DISABLE_MODEL_HOOK"] = "true"
os.environ["HF_TOKEN"] = "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"

# ✅ Login to HuggingFace
login(os.environ["HF_TOKEN"])

# ✅ Use a public model (no gated access)
model_name = "openchat/openchat-3.5-1210"

# ✅ Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)


bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,  # ✅ Enables quantized loading
    llm_int8_threshold=6.0,
)

# ✅ Load model with quantization and offloading setup
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    trust_remote_code=True,
    quantization_config=bnb_config,  # ✅ Updated
    torch_dtype=torch.bfloat16
)

# ✅ Apply LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],  # adjust for your model architecture
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# ✅ Enable gradient checkpointing and FlashAttention support
model.gradient_checkpointing_enable()
model.enable_input_require_grads()

# ✅ Padding token setup
tokenizer.pad_token = tokenizer.eos_token
model.resize_token_embeddings(len(tokenizer))

# ✅ Use streaming for large datasets (if file is large)
dataset = load_dataset("json", data_files="abdul_conversations.jsonl") 

# ✅ Tokenizer map
def tokenize(example):
    tokens = tokenizer(example['text'], padding='max_length', truncation=True, max_length=128)
    tokens['labels'] = tokens['input_ids'].copy()
    return tokens

# ✅ Process with streaming
tokenized = dataset.map(tokenize, batched=True)

# ✅ Training configuration
training_args = TrainingArguments(
    output_dir="./AImodelV1",
    overwrite_output_dir=True,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    save_steps=100,
    save_total_limit=1,
    logging_steps=10,
    fp16=True,  # ✅ Use FP16 if available
    remove_unused_columns=False
)

# ✅ Trainer with LoRA + Quant + Gradient Checkpointing
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],  # For streaming datasets, you can pass iterable directly
)

# ✅ Begin fine-tuning
trainer.train()

# ✅ Save the fine-tuned model
model.save_pretrained('./AImodelV1')
tokenizer.save_pretrained('./AImodelV1')
