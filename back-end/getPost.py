import requests
from urllib.parse import urlparse
import json # Ajouté pour un affichage propre dans la section de test
from atproto import Client
import os
from dotenv import load_dotenv

def get_bluesky_post_info(post_url: str):
    try:
        parsed_url = urlparse(post_url)
        path_parts = parsed_url.path.strip('/').split('/')

        if not (parsed_url.netloc == 'bsky.app' and len(path_parts) == 4 and path_parts[0] == 'profile' and path_parts[2] == 'post'):
            print(f"Erreur (get_bluesky_post_info): URL de post Bluesky invalide: {post_url}")
            # print("Format attendu: https://bsky.app/profile/handle.bsky.social/post/rkey") # Moins verbeux
            return None

        handle = path_parts[1]
        rkey = path_parts[3]
        collection = "app.bsky.feed.post"

        # --- Étape 1: Résoudre le handle en DID ---
        resolve_handle_url = "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle"
        params_resolve = {'handle': handle}
        
        response_resolve = requests.get(resolve_handle_url, params=params_resolve, timeout=10) # Ajout d'un timeout
        response_resolve.raise_for_status() 
        
        did = response_resolve.json().get('did')
        if not did:
            print(f"Erreur (get_bluesky_post_info): Impossible de résoudre le DID pour le handle {handle}")
            return None

        # --- Étape 2: Récupérer le post ---
        get_record_url = "https://public.api.bsky.app/xrpc/com.atproto.repo.getRecord"
        params_record = {
            'repo': did,
            'collection': collection,
            'rkey': rkey
        }
        
        response_record = requests.get(get_record_url, params=params_record, timeout=10) # Ajout d'un timeout
        response_record.raise_for_status()
        
        post_info = response_record.json()
        return post_info

    except requests.exceptions.HTTPError as http_err:
        print(f"Erreur HTTP (get_bluesky_post_info) pour {post_url}: {http_err}")
        # print(f"Réponse de l'API: {http_err.response.text}") # Peut être trop verbeux pour une librairie
        return None
    except requests.exceptions.Timeout:
        print(f"Erreur Timeout (get_bluesky_post_info) pour {post_url}")
        return None
    except requests.exceptions.RequestException as req_err:
        print(f"Erreur de requête (get_bluesky_post_info) pour {post_url}: {req_err}")
        return None
    except Exception as e: # Capture plus large, utile pour les erreurs inattendues (ex: parsing JSON)
        print(f"Une erreur inattendue est survenue dans get_bluesky_post_info pour {post_url}: {e}")
        return None

def get_all_bluesky_posts_for_user(profile_url: str, limit_per_page: int = 100, max_posts: int = 500):
    """
    Fetch all posts for a Bluesky user given their profile URL.
    Returns a list of post records (dicts).
    """
    try:
        parsed_url = urlparse(profile_url)
        path_parts = parsed_url.path.strip('/').split('/')
        if not (parsed_url.netloc == 'bsky.app' and len(path_parts) == 2 and path_parts[0] == 'profile'):
            print(f"Erreur (get_all_bluesky_posts_for_user): URL de profil Bluesky invalide: {profile_url}")
            return []
        handle = path_parts[1]
        # Step 1: Resolve handle to DID
        resolve_handle_url = "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle"
        params_resolve = {'handle': handle}
        response_resolve = requests.get(resolve_handle_url, params=params_resolve, timeout=10)
        response_resolve.raise_for_status()
        did = response_resolve.json().get('did')
        print(f"[DEBUG] Resolved DID for {handle}: {did}")
        if not did:
            print(f"Erreur (get_all_bluesky_posts_for_user): Impossible de résoudre le DID pour le handle {handle}")
            return []
        # Step 2: List posts (paginated)
        list_records_url = "https://public.api.bsky.app/xrpc/com.atproto.repo.listRecords"
        collection = "app.bsky.feed.post"
        cursor = None
        all_posts = []
        while True:
            params = {
                'repo': did,
                'collection': collection,
                'limit': limit_per_page
            }
            if cursor:
                params['cursor'] = cursor
            debug_url = f"{list_records_url}?repo={params['repo']}&collection={params['collection']}&limit={params['limit']}" + (f"&cursor={cursor}" if cursor else "")
            print(f"[DEBUG] Calling: {debug_url}")
            response = requests.get(list_records_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            records = data.get('records', [])
            all_posts.extend(records)
            if 'cursor' in data and data['cursor'] and len(records) > 0 and len(all_posts) < max_posts:
                cursor = data['cursor']
            else:
                break
            if len(all_posts) >= max_posts:
                break
        return all_posts[:max_posts]
    except Exception as e:
        print(f"Erreur dans get_all_bluesky_posts_for_user pour {profile_url}: {e}")
        return []

def get_authenticated_bluesky_posts(profile_handle, limit=100):
    load_dotenv()
    my_handle = os.getenv("BLUESKY_HANDLE")
    my_app_password = os.getenv("BLUESKY_APP_PASSWORD")
    if not my_handle or not my_app_password:
        print("BLUESKY_HANDLE or BLUESKY_APP_PASSWORD not set in .env")
        return []

    client = Client()
    client.login(my_handle, my_app_password)

    # Get the feed for the target user
    posts = []
    cursor = None
    while len(posts) < limit:
        resp = client.app.bsky.feed.get_author_feed(
            {'actor': profile_handle, 'limit': min(100, limit - len(posts)), 'cursor': cursor}
        )
        feed = resp.feed
        posts.extend(feed)
        cursor = resp.cursor
        if not cursor or len(feed) == 0:
            break
    return posts[:limit]
