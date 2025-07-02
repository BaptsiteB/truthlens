import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re
import requests
from urllib.parse import urlparse
from atproto import Client
from atproto_client.models.app.bsky.feed import get_feed

def appeler_gemini(texte_utilisateur: str) -> str:
    load_dotenv()
    api_key = os.getenv("API_KEY")
    prompt_part1 = os.getenv("PROMPT_PART1")
    prompt_part2 = os.getenv("PROMPT_PART2")
    if not api_key:
        return "Erreur : Clé API GOOGLE_API_KEY non trouvée dans le fichier .env."
    if prompt_part1 is None or prompt_part2 is None:
        return "Erreur : PROMPT_PART1 ou PROMPT_PART2 non trouvé dans le fichier .env."
    try:
        genai.configure(api_key=api_key)
        prompt_complet = f"{prompt_part1}\\n\\n--- Début du texte utilisateur ---\\n{texte_utilisateur}\\n--- Fin du texte utilisateur ---\\n\\n{prompt_part2}"
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt_complet)
        return response.text
    except Exception as e:
        return f"Une erreur est survenue lors de l'appel à Gemini : {e}"

def extraire_json_de_reponse(reponse_brute_gemini: str) -> dict | None:
    if not isinstance(reponse_brute_gemini, str):
        print("Erreur : L'entrée pour extraire_json_de_reponse doit être une chaîne de caractères.")
        return None
    reponse_brute_gemini = re.sub(r',\\s*}', '}', reponse_brute_gemini)
    match_json_block = re.search(r"```json\\s*(\{[\\s\\S]*?\\})\\s*```", reponse_brute_gemini)
    if match_json_block:
        json_str = match_json_block.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Erreur de décodage JSON (bloc ```json): {e}\\nContenu du bloc: '{json_str}'")
    match_generic_block = re.search(r"```\\s*(\{[\\s\\S]*?\\})\\s*```", reponse_brute_gemini)
    if match_generic_block:
        json_str = match_generic_block.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Erreur de décodage JSON (bloc ```): {e}\\nContenu du bloc: '{json_str}'")
    try:
        start_index = reponse_brute_gemini.find('{')
        end_index = reponse_brute_gemini.rfind('}')
        if 0 <= start_index < end_index:
            json_str = reponse_brute_gemini[start_index:end_index+1]
            return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Erreur de décodage JSON (brut): {e}\\nContenu tenté: '{json_str}'")
    return None

def appeler_gemini_freeform(prompt: str) -> str:
    load_dotenv()
    api_key = os.getenv("API_KEY")
    if not api_key:
        return "Erreur : Clé API GOOGLE_API_KEY non trouvée dans le fichier .env."
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Une erreur est survenue lors de l'appel à Gemini : {e}"

def get_bluesky_post_info(post_url: str):
    try:
        load_dotenv()
        bsky_handle = os.getenv("BLUESKY_HANDLE")
        bsky_password = os.getenv("BLUESKY_APP_PASSWORD")
        if not bsky_handle or not bsky_password:
            print("Erreur : BLUESKY_HANDLE ou BLUESKY_APP_PASSWORD non trouvé dans le fichier .env.")
            return None

        client = Client()
        client.login(bsky_handle, bsky_password)

        parsed_url = urlparse(post_url)
        path_parts = parsed_url.path.strip('/').split('/')
        if not (parsed_url.netloc == 'bsky.app' and len(path_parts) == 4 and path_parts[0] == 'profile' and path_parts[2] == 'post'):
            return None
        handle = path_parts[1]
        rkey = path_parts[3]
        
        profile = client.get_profile(actor=handle)
        
        uri = f"at://{profile.did}/app.bsky.feed.post/{rkey}"
        response = client.get_post_thread(uri=uri, depth=0)
        
        post_record = json.loads(response.thread.post.model_dump_json())

        return {
            "post": post_record,
            "author": {
                "handle": response.thread.post.author.handle,
                "displayName": response.thread.post.author.display_name,
                "did": response.thread.post.author.did
            }
        }
    except Exception as e:
        print(f"An error occurred in get_bluesky_post_info: {e}")
        return None

def get_authenticated_bluesky_posts(handle: str, limit: int = 50):
    load_dotenv()
    client = Client()
    client.login(os.getenv('BLUESKY_HANDLE'), os.getenv('BLUESKY_APP_PASSWORD'))
    profile = client.get_profile(actor=handle)
    response = client.get_author_feed(actor=profile.did, limit=limit)
    return [json.loads(post.model_dump_json()) for post in response.feed]

def get_posts_from_custom_feed(feed_uri: str, total_limit: int = 100):
    load_dotenv()
    client = Client()
    client.login(os.getenv('BLUESKY_HANDLE'), os.getenv('BLUESKY_APP_PASSWORD'))
    posts = []
    cursor = None
    while len(posts) < total_limit:
        try:
            params = get_feed.Params(feed=feed_uri, cursor=cursor, limit=min(100, total_limit - len(posts)))
            response = client.app.bsky.feed.get_feed(params)
            if not response.feed:
                break
            posts.extend([json.loads(item.post.model_dump_json()) for item in response.feed])
            cursor = response.cursor
            if not cursor:
                break
        except Exception as e:
            print(f"Error fetching custom feed: {e}")
            break
    return posts[:total_limit]
