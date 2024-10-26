# from transformers import pipeline
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

model_name = 'facebook/bart-large-mnli'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Takes in item and categories, and outputs most likely category
def classify_item(item_description, candidate_labels):
    results = {}

    for label in candidate_labels:
        premise = item_description
        hypothesis = f'This example is {label}.'

        inputs = tokenizer.encode(premise, hypothesis, return_tensors='pt', truncation=True)

        with torch.no_grad():
            logits = model(inputs)[0] 

        probabilities = logits.softmax(dim=1)

        prob_label_is_true = probabilities[0][2].item()
        results[label] = prob_label_is_true

    print(results)
    best_label = max(results, key=results.get)
    return best_label

if __name__ == "__main__":
    print("Please enter the item: ")
    item_description = input()
    
    candidate_labels = [
        "Food",
        "Transportation",
        "Utilities",
        "Health/Medical",
        "Clothing/Apparel",
        "Entertainment",
        "Miscellaneous"
    ]
    
    label = classify_item(item_description, candidate_labels)
    print(f"The item '{item_description}' is categorized as '{label}'")