import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, Blueprint
import joblib
import json

app = Flask(__name__)

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
        'Price (GBP)': [data[0]['price']],
        'Market Cap (GBP)': [data[0]['marketCap']],
        'Total Volume': [data[0]['totalVolume']],
        '% 24hr Change': [data[0]['change24h']],
        '% 7d Change': [data[0]['change7d']]
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


app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run()
