import json
from account_analysis import analyse_bluesky_account
from post_analysis import analyse_post
from trend_analysis import analyser_tendance_flux, DEFAULT_WHATS_HOT_FEED_URI

def test_analyse_compte():
    print("--- Test de l'analyse de compte ---")
    # Remplacez par un handle Bluesky que vous souhaitez tester
    handle_a_tester = "iwillnotbesilenced.bsky.social"
    print(f"Analyse du compte : {handle_a_tester}")
    resultat = analyse_bluesky_account(handle_a_tester, sample_size=5, fetch_limit=10)
    print(json.dumps(resultat, indent=2, ensure_ascii=False))
    print("--- Fin du test de l'analyse de compte ---\\n")

def test_analyse_post():
    print("--- Test de l'analyse de post ---")
    # Remplacez par une URL de post Bluesky que vous souhaitez tester
    url_a_tester = "https://bsky.app/profile/cerfiainfo.bsky.social/post/3lefegpnb6k2b"
    print(f"Analyse du post : {url_a_tester}")
    resultat = analyse_post(url_a_tester)
    print(json.dumps(resultat, indent=2, ensure_ascii=False))
    print("--- Fin du test de l'analyse de post ---\\n")

def test_analyse_tendance():
    print("--- Test de l'analyse de tendance ---")
    print(f"Analyse du flux : What's Hot")
    resultat = analyser_tendance_flux(DEFAULT_WHATS_HOT_FEED_URI, nombre_posts=10000)
    if resultat:
        print(json.dumps(resultat, indent=2, ensure_ascii=False))
    print("--- Fin du test de l'analyse de tendance ---\\n")

if __name__ == "__main__":
    print("Début des tests manuels...")
    # Décommentez les fonctions que vous souhaitez exécuter
    test_analyse_compte()
    #test_analyse_post()
    #test_analyse_tendance()
    print("Fin des tests manuels.")