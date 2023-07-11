import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import joblib
import json

from model_update import train_model, clean_data

app = Flask(__name__)
CORS(app)

# BITCOIN LOADING
btc_model = joblib.load("btc_model.joblib")
btc_scaler = joblib.load("btc_scaler.joblib")

# ETHEREUM LOADING
eth_model = joblib.load("eth_model.joblib")
eth_scaler = joblib.load("eth_scaler.joblib")

# Create a Flask blueprint with the base URL prefix
api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/')
def root():
    return 'Thesis: Miguel Remedios'


@api_bp.route('/predict', methods=['POST'])
def predict():
    request_data = request.get_json()
    currency = request_data['currency']
    data = request_data['data']

    print("Currency: ", currency)

    data2 = {
        'price': [data[0]['price']],
        'marketCap': [data[0]['marketCap']],
        'totalVolume': [data[0]['totalVolume']],
        'change24h': [data[0]['change24h']],
        'change7d': [data[0]['change7d']]
    }

    df = pd.DataFrame(data2)
    print(df)

    prediction_scaled = None

    if currency == "bitcoin":
        model_data_normalized = btc_scaler.transform(df)
        print(model_data_normalized)
        prediction = btc_model.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    elif currency == "ethereum":
        model_data_normalized = eth_scaler.transform(df)
        print(model_data_normalized)
        prediction = eth_model.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    else:
        return "Coin not permitted!"

    value = {
        "currency": currency,
        "response": prediction_scaled
    }

    return json.dumps(value)


@api_bp.route('/update/bitcoin', methods=['POST'])
def update_model1():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "btc")
        print(accuracy)
        return "BTC model updated successfully!"
    except Exception as e:
        return str(e)


@api_bp.route('/update/ethereum', methods=['POST'])
def update_model2():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "eth")
        print(accuracy)
        return "ETH model updated successfully!"
    except Exception as e:
        return str(e)


app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run()
