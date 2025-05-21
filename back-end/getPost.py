import requests
from urllib.parse import urlparse
import json # Ajouté pour un affichage propre dans la section de test

def get_bluesky_post_info(post_url: str):
    """
    Récupère les informations d'un post Bluesky à partir de son URL.
    La fonction est conçue pour être appelée depuis un autre module.
    Les impressions console sont limitées aux erreurs empêchant la récupération.

    Args:
        post_url (str): L'URL complète du post Bluesky.
                        (ex: https://bsky.app/profile/nomutilisateur.bsky.social/post/xxxxxxxxxxxxx)

    Returns:
        dict: Un dictionnaire contenant les informations du post, ou None en cas d'erreur.
    """
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

# --- Section pour le test et le débogage ---
# Cette partie ne s'exécute que si le script est lancé directement (python votre_fichier.py)
# et non lorsqu'il est importé par un autre script.
if __name__ == "__main__":
    print("--- Mode Test/Debug de get_bluesky_post.py ---")
    
    # Décommentez la ligne suivante pour tester avec une saisie console :
    # test_url_input = input("Entrez l'URL du post Bluesky pour test: ")
    
    # Ou utilisez une URL de test fixe :
    test_url_fixed = "https://bsky.app/profile/zoink.bsky.social/post/3l6xcs2mynp2t" 
    # test_url_fixed_invalid = "https://example.com" 
    # test_url_fixed_not_found = "https://bsky.app/profile/zoink.bsky.social/post/0000000000000"


    selected_test_url = test_url_fixed # Choisissez l'URL à tester ici

    if selected_test_url:
        print(f"\nTest avec l'URL: {selected_test_url}")
        data = get_bluesky_post_info(selected_test_url)

        if data:
            print("\n--- Informations du Post (brutes JSON) ---")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Exemple d'extraction d'informations spécifiques
            post_text = data.get('value', {}).get('text')
            created_at = data.get('value', {}).get('createdAt')
            
            if post_text:
                 print(f"\n--- Texte du Post ---")
                 print(post_text)
            if created_at:
                print(f"\n--- Date de création ---")
                print(created_at)
        else:
            print(f"\nAucune donnée n'a pu être récupérée pour {selected_test_url}")
    else:
        print("Aucune URL de test n'a été fournie dans la section __main__.")

    print("\n--- Fin du Mode Test/Debug ---")