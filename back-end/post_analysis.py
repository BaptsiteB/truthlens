from utils import get_bluesky_post_info, appeler_gemini, extraire_json_de_reponse
import json
from urllib.parse import urlparse
import re

def analyse_post(url):
    if not re.match(r"^https://bsky\.app/profile/[^/]+/post/[^/]+$", url):
        return {"erreur": "Le format de l'URL n'est pas un lien de post Bluesky valide."}

    fullpost = get_bluesky_post_info(url)
    if not fullpost:
        return {"erreur": f"Le post à l'URL {url} est introuvable ou n'a pas pu être récupéré."}

    post_text = fullpost.get('value', {}).get('text', '')
    if not post_text:
        return {"erreur": "Le post ne contient pas de texte à analyser."}

    created_at = fullpost.get('value', {}).get('createdAt', '')
    author_handle = urlparse(url).path.split('/')[2]

    output = extraire_json_de_reponse(appeler_gemini(post_text))

    is_political = output.get('isPolitical', False)
    factual = output.get('containsFactualInformation', False)
    emotions = output.get('emotions', [])
    percentage_fake_news = output.get('percentageFakeNews', 0)
    explanation = output.get('fakeNewsJustification', '')

    output_json = {
        "post": post_text,
        "auteur": author_handle,
        "cree_le": created_at,
        "estPolitique": is_political,
        "contientInformationFactuelle": factual,
        "emotions": emotions,
        "pourcentageFakeNews": percentage_fake_news,
        "justification": explanation
    }
    return output_json

if __name__ == '__main__':
    # Replace with a real Bluesky post URL to test
    test_url = "https://bsky.app/profile/jay.bsky.team/post/3kuhv3f2c2u2u"
    result = analyse_post(test_url)
    print(json.dumps(result, indent=2, ensure_ascii=False))
