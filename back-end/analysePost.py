from getPost import get_bluesky_post_info as getPost
from gemini import appeler_gemini, extraire_json_de_reponse
import json


def analyse_post(url):
    fullpost = getPost(url)

    post = fullpost['value']['text']
    created_at = fullpost['value']['createdAt']
    author = url.split('/')[4]

    output = extraire_json_de_reponse(appeler_gemini(post))

    isPolitical = output.get('isPolitical', False)
    factual = output.get('containsFactualInformation', False)
    emotions = output.get('emotions', [])
    percentageFakeNews = output.get('percentageFakeNews', 0)
    explanation = output.get('fakeNewsJustification', '')

    output_json = {
        "post": post,
        "author": author,
        "created_at": created_at,
        "isPolitical": isPolitical,
        "containsFactualInformation": factual,
        "emotions": emotions,
        "percentageFakeNews": percentageFakeNews,
        "justification": explanation
    }
    output_json_str = json.dumps(output_json, indent=2, ensure_ascii=False)
    print(output_json_str)