from utils import get_bluesky_post_info, appeler_gemini, extraire_json_de_reponse
import json
from urllib.parse import urlparse
import re

def analyse_post(url):
    if not re.match(r"^https://bsky\.app/profile/[^/]+/post/[^/]+$", url):
        return {"error": "Le format de l'URL n'est pas un lien de post Bluesky valide."}

    post_info = get_bluesky_post_info(url)
    if not post_info or 'post' not in post_info or 'author' not in post_info:
        return {"error": f"Le post à l'URL {url} est introuvable ou n'a pas pu être récupéré."}

    post_record = post_info.get('post', {}).get('record', {})
    post_text = post_record.get('text', '')

    if not post_text:
        return {"error": "Le post ne contient pas de texte à analyser."}

    gemini_analysis = extraire_json_de_reponse(appeler_gemini(post_text))
    if not gemini_analysis:
        return {"error": "L'analyse du post par l'IA a échoué."}


    percentage_fake_news = gemini_analysis.get('percentageFakeNews', 100)
    fiabilite_score = 100 - percentage_fake_news

    # Construction du JSON final pour le front-end
    output_json = {
        "post_details": {
            "author": post_info.get('author'),
            "text": post_text,
            "createdAt": post_record.get('createdAt')
        },
        "fiabilite_score": round(fiabilite_score, 1),
        "emotions": gemini_analysis.get('emotions', []),
        "is_political": gemini_analysis.get('isPolitical', False),
        "factual": gemini_analysis.get('containsFactualInformation', False),
        "explanation": gemini_analysis.get('fakeNewsJustification', '')
    }
    return output_json

if __name__ == '__main__':
    # Replace with a real Bluesky post URL to test
    test_url = "https://bsky.app/profile/jay.bsky.team/post/3kuhv3f2c2u2u"
    result = analyse_post(test_url)
    print(json.dumps(result, indent=2, ensure_ascii=False))
