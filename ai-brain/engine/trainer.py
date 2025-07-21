import json
import os
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling

def fine_tune_model(path_to_data='brain.json'):
    if not os.path.exists(path_to_data):
        print("No brain data found to fine-tune.")
        return

    with open(path_to_data, 'r') as f:
        data = json.load(f)

    dialogues = [
        {'text': data[i] + "\n" + data[i+1]}
        for i in range(0, len(data) - 1, 2)
        if data[i].startswith('User:') and data[i+1].startswith('Abdul:')
    ]

    if not dialogues:
        print("Not enough conversation pairs for training.")
        return

    dataset = Dataset.from_list(dialogues)
    tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
    tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

    def tokenize_function(example):
        return tokenizer(example['text'], truncation=True, padding='max_length', max_length=128)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    training_args = TrainingArguments(
        output_dir="./fine-tuned-model",
        per_device_train_batch_size=2,
        num_train_epochs=2,
        save_steps=10,
        logging_steps=10,
        save_total_limit=1,
        logging_dir='./logs',
        overwrite_output_dir=True
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        tokenizer=tokenizer,
        data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
    )

    print("[Trainer] Starting fine-tuning...")
    trainer.train()
    trainer.save_model("./fine-tuned-model")
    print("[Trainer] Fine-tuning complete. Model saved.")