import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, Blueprint
import joblib
import json

app = Flask(__name__)

btc_model = joblib.load("btc_model.joblib")
scaler = joblib.load("btc_scaler.joblib")

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

    model_data_normalized = scaler.transform(df)
    print(model_data_normalized)

    prediction_scaled = None

    if currency == "bitcoin":
        prediction = btc_model.predict(model_data_normalized)
        prediction_scaled = prediction.item(0)
    elif currency == "ethereum":
        return "Ethereum"
    else:
        return "Coin not permitted!"

    value = {
        "response": prediction_scaled
    }

    return json.dumps(value)


# Register the blueprint with the Flask app
app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run()
