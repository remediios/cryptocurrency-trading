import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_curve, auc, confusion_matrix
from sklearn.metrics import roc_curve, auc
from sklearn.preprocessing import label_binarize
from scipy import interp
import seaborn as sns
import matplotlib.pyplot as plt
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

def train_model(df, currency, timeGranularity):
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

    # Calculate overall metrics for the entire model
    average_strategy = 'weighted'
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average=average_strategy)

    # Print the overall metrics
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-Score: {f1:.4f}")

    # Compute the confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    # Create a heatmap for the confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
    plt.title(f'{currency}_{timeGranularity} Confusion Matrix (Accuracy: {accuracy:.4f})')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    # plt.savefig(f'{currency}_{timeGranularity}.png')
    # plt.show()

    # PLOT ROC CURVE FOR ALL CLASSES
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
    y_pred_prob = nb_classifier.predict_proba(X_test)

    fpr = dict()
    tpr = dict()
    roc_auc = dict()

    for i in range(len(label_encoder.classes_)):
        fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], y_pred_prob[:, i])
        roc_auc[i] = auc(fpr[i], tpr[i])

    plt.figure(figsize=(10, 8))
    colors = ['blue', 'orange', 'green']

    for i, color in zip(range(len(label_encoder.classes_)), colors):
        plt.plot(fpr[i], tpr[i], color=color, lw=2, label=f'Class {label_mapping[i]} (AUC = {roc_auc[i]:.2f})')

    plt.plot([0, 1], [0, 1], color='gray', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title(f'{currency}_{timeGranularity} ROC Graph')
    plt.legend(loc="lower right")
    # plt.savefig(f'{currency}_{timeGranularity}.png')
    # plt.show()

    joblib.dump(nb_classifier, f"models/{currency}_model_{timeGranularity}.joblib")
    # Save the scaler
    joblib.dump(scaler, f"scalers/{currency}_scaler_{timeGranularity}.joblib")
    return accuracy
