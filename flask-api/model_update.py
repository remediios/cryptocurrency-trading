import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score
import joblib


def clean_data(df):
    # Check for NA values
    na_values_btc = df.isna().any()
    print("Indexes with NA: ", na_values_btc[na_values_btc].index)
    # Count NA values in each column
    na_counts = df.isna().sum()
    # Print columns with NA values
    print(na_counts[na_counts > 0])
    # Remove records with NA values
    df_cleaned = df.dropna()
    # Remove records where 'Total Volume' is 0
    df_filtered = df_cleaned[df_cleaned['totalVolume'] != 0]
    return df_filtered


def train_model(df, currency):
    label_encoder = LabelEncoder()
    df['label'] = label_encoder.fit_transform(df['label'])

    # Get the mapping between the encoded labels and the original classes
    label_mapping = dict(zip(range(len(label_encoder.classes_)), label_encoder.classes_))

    # Print the mapping
    for encoded_label, original_class in label_mapping.items():
        print(f"Encoded Label: {encoded_label} --> Original Class: {original_class}")

    selected_columns = df.iloc[:, [2, 3, 4, 5, 6, 7]]

    # Split the data into features (X) and target label (y)
    X = selected_columns.iloc[:, :-1]
    y = selected_columns.iloc[:, -1]

    # Normalize the data
    scaler = MinMaxScaler()
    X_normalized = scaler.fit_transform(X)

    # Naive Bayes Model
    X_train, X_test, y_train, y_test = train_test_split(X_normalized, y, test_size=0.3, random_state=42)

    # Initialize a Gaussian Naive Bayes classifier
    nb_classifier = GaussianNB()

    # Train the classifier
    nb_classifier.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = nb_classifier.predict(X_test)

    # Calculate the accuracy of the classifier
    accuracy = accuracy_score(y_test, y_pred)

    joblib.dump(nb_classifier, f"{currency}_model.joblib")
    # Save the scaler
    joblib.dump(scaler, f"{currency}_scaler.joblib")
    return accuracy
