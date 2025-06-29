import json
from utils import get_posts_from_custom_feed, appeler_gemini_freeform

DEFAULT_WHATS_HOT_FEED_URI = "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot"

def analyser_tendance_flux(feed_uri: str, nombre_posts: int = 100):
    print(f"Récupération de ~{nombre_posts} posts depuis le flux : {feed_uri}...")
    posts_data = get_posts_from_custom_feed(feed_uri, total_limit=nombre_posts)

    if not posts_data:
        print("Aucun post récupéré. Impossible d'analyser la tendance.")
        return None

    print(f"{len(posts_data)} posts récupérés avec succès.")

    textes_posts = [post['record']['text'] for post in posts_data if post.get('record') and post['record'].get('text')]

    if not textes_posts:
        print("Aucun contenu textuel trouvé dans les posts récupérés.")
        return None

    corpus_analyse = "\n\n--- NOUVEAU POST ---\n\n".join(textes_posts)

    prompt_gemini = f"""
    Voici une collection de publications récentes provenant d'un flux de réseau social.
    Analysez ces publications pour identifier les tendances générales, les sujets de discussion principaux,
    les sentiments récurrents et toute autre observation pertinente sur ce qui semble être populaire ou discuté actuellement.
    Fournissez une synthèse claire et concise de ces tendances en français.

    --- DÉBUT DES POSTS ---
    {corpus_analyse}
    --- FIN DES POSTS ---

    Analyse des tendances :
    """

    print("\nAppel à Gemini pour l'analyse des tendances...")
    reponse_gemini = appeler_gemini_freeform(prompt_gemini)

    if "Erreur :" in reponse_gemini:
        print(f"Erreur lors de l'appel à Gemini : {reponse_gemini}")
        return {"erreur": reponse_gemini, "analyse_brute": None}

    print("\n--- Analyse de Tendance par Gemini ---")
    print(reponse_gemini)
    print("--- Fin de l'Analyse ---")

    return {"analyse_brute": reponse_gemini}

if __name__ == "__main__":
    analyser_tendance_flux(DEFAULT_WHATS_HOT_FEED_URI, nombre_posts=50)
