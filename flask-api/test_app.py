import json

import pytest
from app import app


class TestAPIEndpoints:

    @pytest.fixture
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client

    def test_predict_daily_endpoint(self, client):
        data = {
            "currency": "bitcoin",
            "data": [{
                "price": 50000,
                "marketCap": 1000000000,
                "totalVolume": 500000,
                "change24h": 0.05,
                "change7d": 0.1
            }]
        }
        response = client.post('/api/predict/daily', json=data)
        assert response.status_code == 200
        response_data = json.loads(response.data.decode('utf-8'))
        assert 'currency' in response_data
        assert 'response' in response_data

    def test_predict_hourly_endpoint(self, client):
        data = {
            "currency": "ethereum",
            "data": [{
                "price": 50000,
                "marketCap": 1000000000,
                "totalVolume": 500000,
                "change24h": 0.05,
                "change7d": 0.1
            }]
        }
        response = client.post('/api/predict/hourly', json=data)
        assert response.status_code == 200
        response_data = json.loads(response.data.decode('utf-8'))
        assert 'currency' in response_data
        assert 'response' in response_data

if __name__ == '__main__':
    pytest.main()
