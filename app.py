from flask import Flask, render_template, request, jsonify
from utils import get_data_from_csv, to_unix_time
import json
from datetime import datetime, timedelta

app = Flask(__name__)


@app.route('/', methods = ['GET','POST'])
def index():
    return render_template('home.html')

@app.route('/bots', methods = ['GET','POST'])
def index_bots():
    return render_template('bots.html')

@app.route('/markets', methods = ['GET','POST'])
def index_market():
    return render_template('markets.html')

@app.route('/wallet', methods = ['GET','POST'])
def index_wallet():
    return render_template('wallet.html')

@app.route('/get_data')
def get_data():
    id = request.args.get("timestamp", default=0, type=str)
    time_id = to_unix_time(id)
    data = get_data_from_csv(time_id, 120)
    print(time_id)
    print(data["o"])
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=False, port=5000)
