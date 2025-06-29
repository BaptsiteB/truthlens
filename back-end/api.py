from flask import Flask, request, jsonify
from flask_cors import CORS
from account_analysis import analyse_bluesky_account
from post_analysis import analyse_post
from trend_analysis import analyser_tendance_flux, DEFAULT_WHATS_HOT_FEED_URI

app = Flask(__name__)
CORS(app)

@app.route('/vet/post', methods=['POST'])
def vet_post():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "URL du post manquante"}), 400
    try:
        result = analyse_post(data['url'])
        if result and result.get("error"):
            # Si la fonction d'analyse retourne une erreur gérée (ex: post non trouvé)
            return jsonify(result), 404 # 404 Not Found est plus approprié ici
        return jsonify(result)
    except Exception as e:
        # Pour les erreurs inattendues
        return jsonify({"error": str(e)}), 500

@app.route('/vet/account', methods=['POST'])
def vet_account():
    data = request.get_json()
    if not data or 'handle' not in data:
        return jsonify({"error": "Handle du compte manquant"}), 400
    try:
        result = analyse_bluesky_account(data['handle'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/vet/trend', methods=['GET'])
def vet_trend():
    feed_uri = request.args.get('feed_uri', DEFAULT_WHATS_HOT_FEED_URI)
    try:
        result = analyser_tendance_flux(feed_uri)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
