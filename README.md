# Sentiment Analysis

Sentiment analysis is the process of computationally identifying and categorizing opinions expressed in a piece of text, especially in order to determine whether the writer's attitude towards a particular topic, product, etc., is positive, negative, or neutral. This project utilizes natural language processing techniques to perform sentiment analysis.


import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.utils.class_weight import compute_class_weight
import joblib
import os

# Download necessary NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')

# Load or initialize vectorizer and model
vectorizer_path = 'tfidf_vectorizer.pkl'
model_path = 'sentiment_model.pkl'

def load_vectorizer():
    return joblib.load(vectorizer_path) if os.path.exists(vectorizer_path) else TfidfVectorizer()

def load_model():
    return joblib.load(model_path) if os.path.exists(model_path) else SGDClassifier(loss='hinge')

tfidf = load_vectorizer()
model = load_model()

# Load data incrementally
def load_data():
    files = ['/content/sentiment_data.csv', '/content/sentiment_data_2.csv', '/content/sentiment_data_3csv.csv']
    data = pd.concat([pd.read_csv(f) for f in files])
    data.dropna(inplace=True)
    data['class'] = data['class'].astype(int)
    data['Tweet'] = data['Tweet'].astype(str)
    return data

# Advanced text preprocessing
def clean_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'http\S+', '', text)  # Remove URLs
    text = re.sub(r'@\w+', '', text)  # Remove mentions
    text = re.sub(r'#', '', text)  # Remove hashtag symbol
    text = re.sub(r'[^a-zA-Z]', ' ', text)  # Keep only letters
    text = text.lower().split()
    text = [lemmatizer.lemmatize(word) for word in text if word not in stop_words]
    return ' '.join(text)

# Load and clean data
data = load_data()
data['Cleaned_Tweet'] = data['Tweet'].apply(clean_text)

# Incrementally update TF-IDF
def update_vectorizer(new_texts):
    global tfidf
    if isinstance(tfidf, TfidfVectorizer):
        tfidf = TfidfVectorizer(vocabulary=tfidf.vocabulary_)
    return tfidf.fit_transform(new_texts)

X = update_vectorizer(data['Cleaned_Tweet'])
y = data['class']

# Compute class weights for imbalance
class_weights = compute_class_weight('balanced', classes=np.unique(y), y=y)
class_weight_dict = {i: class_weights[i] for i in np.unique(y)}

# Incrementally train model
if isinstance(model, SGDClassifier):
    model.partial_fit(X, y, classes=np.unique(y))
else:
    model = SGDClassifier(loss='hinge', class_weight=class_weight_dict)
    model.partial_fit(X, y, classes=np.unique(y))

# Save model and vectorizer
joblib.dump(model, model_path)
joblib.dump(tfidf, vectorizer_path)

print("Incremental learning model updated and saved successfully!")



import re
import string
import pandas as pd
import numpy as np
import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from datasets import Dataset
from fastapi import FastAPI, HTTPException
import uvicorn

# Load Dataset
def load_dataset():
    df = pd.read_csv("labeled_tweets.csv")  # Replace with your dataset path
    df = df[['text', 'label']]
    return df

# Preprocessing Function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)  # Remove punctuation
    text = re.sub(r'\d+', '', text)  # Remove numbers
    return text

# Tokenization & Encoding
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

def encode_texts(texts):
    return tokenizer(texts, truncation=True, padding=True, max_length=128, return_tensors="pt")

# Load & Preprocess Data
df = load_dataset()
df['text'] = df['text'].apply(preprocess_text)

# Train-Test Split
train_texts, val_texts, train_labels, val_labels = train_test_split(df['text'], df['label'], test_size=0.2, stratify=df['label'])

# Convert to Dataset Format
train_encodings = encode_texts(train_texts.tolist())
val_encodings = encode_texts(val_texts.tolist())

def format_dataset(encodings, labels):
    return Dataset.from_dict({
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask'],
        'labels': torch.tensor(labels.values, dtype=torch.long)
    })

train_dataset = format_dataset(train_encodings, train_labels)
val_dataset = format_dataset(val_encodings, val_labels)

# Model Definition
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(df['label'].unique()))

# Training Arguments
training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy='epoch',
    save_strategy='epoch',
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
)

# Trainer Object
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

# Train Model
trainer.train()

# Save Model
model.save_pretrained("sentiment_model")
tokenizer.save_pretrained("sentiment_model")

# FastAPI for Deployment
app = FastAPI()

@app.post("/predict")
def predict_sentiment(text: str):
    encoding = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        output = model(**encoding)
    prediction = torch.argmax(output.logits, dim=1).item()
    return {"text": text, "sentiment": prediction}

# Run FastAPI
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



import re
import string
import pandas as pd
import numpy as np
import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments, pipeline
from sklearn.model_selection import train_test_split
from datasets import Dataset
from fastapi import FastAPI, HTTPException
import uvicorn

# Load Dataset
def load_dataset():
    df = pd.read_csv("labeled_tweets.csv")  # Replace with your dataset path
    df = df[['text', 'label']]
    return df

# Preprocessing Function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)  # Remove punctuation
    text = re.sub(r'\d+', '', text)  # Remove numbers
    return text

# Tokenization & Encoding
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

def encode_texts(texts):
    return tokenizer(texts, truncation=True, padding=True, max_length=128, return_tensors="pt")

# Load & Preprocess Data
df = load_dataset()
df['text'] = df['text'].apply(preprocess_text)

# Train-Test Split
train_texts, val_texts, train_labels, val_labels = train_test_split(df['text'], df['label'], test_size=0.2, stratify=df['label'])

# Convert to Dataset Format
def format_dataset(texts, labels):
    encodings = encode_texts(texts.tolist())
    return Dataset.from_dict({
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask'],
        'labels': torch.tensor(labels.values, dtype=torch.long)
    })

train_dataset = format_dataset(train_texts, train_labels)
val_dataset = format_dataset(val_texts, val_labels)

# Model Definition
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(df['label'].unique()))

# Training Arguments
training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy='epoch',
    save_strategy='epoch',
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
)

# Trainer Object
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

# Train Model
trainer.train()

# Save Model
model.save_pretrained("sentiment_model")
tokenizer.save_pretrained("sentiment_model")

# Load Model as a Pipeline
sentiment_pipeline = pipeline("text-classification", model="sentiment_model", tokenizer="sentiment_model")

# FastAPI for Deployment
app = FastAPI()

@app.post("/predict")
def predict_sentiment(text: str):
    result = sentiment_pipeline(text)
    return {"text": text, "sentiment": result[0]['label']}

# Run FastAPI
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
