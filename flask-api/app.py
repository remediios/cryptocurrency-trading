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
btc_model_daily = joblib.load("btc_model_daily.joblib")
btc_scaler_daily = joblib.load("btc_scaler_daily.joblib")
btc_model_hourly = joblib.load("btc_model_hourly.joblib")
btc_scaler_hourly = joblib.load("btc_scaler_hourly.joblib")

# ETHEREUM LOADING
eth_model_daily = joblib.load("eth_model_daily.joblib")
eth_scaler_daily = joblib.load("eth_scaler_daily.joblib")
eth_model_hourly = joblib.load("eth_model_hourly.joblib")
eth_scaler_hourly = joblib.load("eth_scaler_hourly.joblib")

# Create a Flask blueprint with the base URL prefix
api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/')
def root():
    return 'Thesis: Miguel Remedios'


@api_bp.route('/predict/daily', methods=['POST'])
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
        model_data_normalized = btc_scaler_daily.transform(df)
        print(model_data_normalized)
        prediction = btc_model_daily.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    elif currency == "ethereum":
        model_data_normalized = eth_scaler_daily.transform(df)
        print(model_data_normalized)
        prediction = eth_model_daily.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    else:
        return "Coin not permitted!"

    value = {
        "currency": currency,
        "response": prediction_scaled
    }

    return json.dumps(value)


@api_bp.route('/predict/hourly', methods=['POST'])
def predict2():
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
        model_data_normalized = btc_scaler_hourly.transform(df)
        print(model_data_normalized)
        prediction = btc_model_hourly.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    elif currency == "ethereum":
        model_data_normalized = eth_scaler_hourly.transform(df)
        print(model_data_normalized)
        prediction = eth_model_hourly.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    else:
        return "Coin not permitted!"

    value = {
        "currency": currency,
        "response": prediction_scaled
    }

    return json.dumps(value)


@api_bp.route('/update/bitcoin/daily', methods=['POST'])
def update_model1():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "btc", "daily")
        print(accuracy)
        return "BTC DAILY model updated successfully!"
    except Exception as e:
        return str(e)


@api_bp.route('/update/ethereum/daily', methods=['POST'])
def update_model2():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "eth", "daily")
        print(accuracy)
        return "ETH DAILY model updated successfully!"
    except Exception as e:
        return str(e)


@api_bp.route('/update/bitcoin/hourly', methods=['POST'])
def update_model3():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "btc", "hourly")
        print(accuracy)
        return "BTC HOURLY model updated successfully!"
    except Exception as e:
        return str(e)


@api_bp.route('/update/ethereum/hourly', methods=['POST'])
def update_model4():
    try:
        request_data = request.get_json()
        df = pd.DataFrame.from_records(request_data)  # Convert JSON list to DataFrame
        cleaned_data = clean_data(df)
        accuracy = train_model(cleaned_data, "eth", "hourly")
        print(accuracy)
        return "ETH HOURLY model updated successfully!"
    except Exception as e:
        return str(e)


app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run()
