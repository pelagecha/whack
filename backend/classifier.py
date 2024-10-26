from transformers import pipeline
import numpy as np

def classify(inp, classes):
    # Load the zero-shot classification pipeline
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    # Perform classification
    result = classifier(inp, classes)

    # Return results
    return classes[np.argmax(result['scores'])]

if __name__ == "__main__":
    print(classify(input(), ["Food", "Clothing", "Electronics", "Health", "Stationery"]))