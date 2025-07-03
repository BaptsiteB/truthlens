from utils import get_authenticated_bluesky_posts, appeler_gemini, extraire_json_de_reponse, appeler_gemini_freeform
import random
from collections import Counter
import json
import re

def normaliser_handle(handle_input: str) -> str | None:
    """Normalise les différents formats de handle en un handle simple."""
    handle_input = handle_input.strip()
    # Format URL: https://bsky.app/profile/handle.bsky.social
    match = re.match(r"https://bsky.app/profile/([^/]+)", handle_input)
    if match:
        return match.group(1)
    # Format @: @handle.bsky.social
    if handle_input.startswith('@'):
        return handle_input[1:]
    # Format simple: handle.bsky.social (on suppose qu'il est déjà correct)
    # On peut ajouter une validation plus stricte si nécessaire (ex: regex pour les domaines)
    if ' ' not in handle_input and '.' in handle_input:
        return handle_input
    return None

def analyse_bluesky_account(target_handle, sample_size=50, fetch_limit=50):
    handle = normaliser_handle(target_handle)
    if not handle:
        return {"erreur": "Format de handle invalide."}

    try:
        posts = get_authenticated_bluesky_posts(handle, limit=fetch_limit)
    except Exception as e:
        error_str = str(e).lower()
        if "could not find user" in error_str or "profile not found" in error_str:
            return {"erreur": f"Le compte Bluesky ''{handle}'' est introuvable."}
        if "actor must be a valid did or a handle" in error_str or "invalid handle" in error_str:
            return {"erreur": f"Le format du handle ''{target_handle}'' est invalide ou le compte n'existe pas."}
        # Fallback pour les autres erreurs inattendues
        return {"erreur": "Une erreur inattendue est survenue lors de la communication avec Bluesky."}

    if len(posts) > sample_size:
        sampled_posts = random.sample(posts, sample_size)
    else:
        sampled_posts = posts

    fake_news_percentages = []
    fake_news_justifications = []
    all_emotions_list = []
    political_count = 0
    factual_count = 0
    analysed_count = 0
    posts_texts = []

    for i, post in enumerate(sampled_posts):
        print(f"Analyse du post {i+1}/{len(sampled_posts)}...")
        try:
            text = post['post']['record']['text']
        except (KeyError, AttributeError):
            text = ''
        if not text:
            print("Post sans texte, ignoré.")
            continue
        try:
            print("Appel à Gemini...")
            output = extraire_json_de_reponse(appeler_gemini(text))
            print("Retour de Gemini.")
        except Exception as e:
            print(f"Erreur lors de l'appel à Gemini : {e}")
            continue
        if not output:
            print("Pas de JSON valide retourné par Gemini, ignoré.")
            continue
        posts_texts.append(text)
        analysed_count += 1
        fake_news_percentages.append(output.get('percentageFakeNews', 0))
        if output.get('fakeNewsJustification'):
            fake_news_justifications.append(output['fakeNewsJustification'])
        
        emotions = output.get('emotions', [])
        if isinstance(emotions, list):
            all_emotions_list.extend(emotions) # Utiliser extend au lieu de append

        if output.get('isPolitical', False):
            political_count += 1
        if output.get('containsFactualInformation', False):
            factual_count += 1

    avg_fake_news = sum(fake_news_percentages) / len(fake_news_percentages) if fake_news_percentages else 0
    
    # Logique de comptage des émotions corrigée et simplifiée
    if all_emotions_list:
        # On s'assure que les éléments sont bien des dictionnaires avec un 'label'
        valid_emotions = [tuple(e.items()) for e in all_emotions_list if isinstance(e, dict) and 'label' in e]
        if valid_emotions:
            emotion_counts = Counter(valid_emotions)
            most_common_tuples = emotion_counts.most_common(5)
            # Reconvertir les tuples en dictionnaires pour le JSON final
            most_common_emotions = [dict(e_tuple) for e_tuple, count in most_common_tuples]
        else:
            most_common_emotions = []
    else:
        most_common_emotions = []

    political_ratio = (political_count / analysed_count) * 100 if analysed_count else 0
    factual_ratio = (factual_count / analysed_count) * 100 if analysed_count else 0

    if posts_texts:
        joined_text = '\n'.join(posts_texts[:50])
        prompt = (
            "Voici une liste de publications d'un compte Bluesky. "
            "En 2 ou 3 courtes phrases, résumez simplement en français les principaux sujets ou thèmes abordés par ce compte. "
            "N'utilisez pas de puces ou de listes. Soyez bref, clair et évitez les détails.\n\n"
            + joined_text
        )
        topic_summary = appeler_gemini_freeform(prompt).strip()
    else:
        topic_summary = "Aucun texte à analyser."

    result_json = {
        "profile": target_handle,
        "posts_analyzed_count": analysed_count,
        "fake_news_percentage": round(avg_fake_news, 1),
        "common_emotions": most_common_emotions,
        "political_posts_percentage": round(political_ratio, 1),
        "factual_posts_percentage": round(factual_ratio, 1),
        "summary": topic_summary
    }
    return result_json

if __name__ == "__main__":
    res = analyse_bluesky_account("mcuban.bsky.social", sample_size=10, fetch_limit=20)
    print(json.dumps(res, indent=2, ensure_ascii=False))
