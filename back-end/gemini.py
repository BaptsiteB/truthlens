import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

def appeler_gemini(texte_utilisateur: str) -> str:
    """
    Prend un texte en entrée, construit un prompt avec des parties provenant
    d'un fichier .env, et appelle l'API Gemini pour obtenir une réponse.

    Args:
        texte_utilisateur: Le texte fourni par l'utilisateur à insérer dans le prompt.

    Returns:
        La réponse textuelle brute de Gemini, ou un message d'erreur.
    """
    # Charger les variables d'environnement depuis le fichier .env
    load_dotenv()

    api_key = os.getenv("API_KEY")
    prompt_part1 = os.getenv("PROMPT_PART1")
    prompt_part2 = os.getenv("PROMPT_PART2")

    # Vérifications
    if not api_key:
        return "Erreur : Clé API GOOGLE_API_KEY non trouvée dans le fichier .env."
    if prompt_part1 is None or prompt_part2 is None:
        return "Erreur : PROMPT_PART1 ou PROMPT_PART2 non trouvé dans le fichier .env."

    try:
        # Configurer l'API Gemini avec votre clé
        genai.configure(api_key=api_key)

        # Construire le prompt complet
        prompt_complet = f"{prompt_part1}\n\n--- Début du texte utilisateur ---\n{texte_utilisateur}\n--- Fin du texte utilisateur ---\n\n{prompt_part2}"

        # Sélectionner le modèle (gemini-1.5-flash est un bon choix pour commencer)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        # print("Envoi du prompt à Gemini...")
        # print("---------------------------")
        # # Décommentez la ligne suivante si vous voulez voir le prompt complet envoyé
        # # print(prompt_complet)
        # print("---------------------------")

        response = model.generate_content(prompt_complet)

        # Retourner le texte de la réponse brute
        return response.text

    except Exception as e:
        return f"Une erreur est survenue lors de l'appel à Gemini : {e}"

def extraire_json_de_reponse(reponse_brute_gemini: str) -> dict | None:
    """
    Extrait un objet JSON d'une chaîne de caractères brute, typiquement
    la réponse d'un LLM comme Gemini.

    La fonction cherche un bloc JSON dans les formats suivants (par ordre de priorité) :
    1. ```json ... ```
    2. ``` ... ```
    3. Un objet JSON brut (commençant par '{' et finissant par '}')

    Args:
        reponse_brute_gemini: La chaîne de caractères contenant potentiellement le JSON.

    Returns:
        Un dictionnaire Python si un JSON valide est trouvé et parsé,
        sinon None.
    """
    if not isinstance(reponse_brute_gemini, str):
        print("Erreur : L'entrée pour extraire_json_de_reponse doit être une chaîne de caractères.")
        return None

    # Avant de parser, retire la dernière virgule avant la fermeture }
    reponse_brute_gemini = re.sub(r',\\s*}', '}', reponse_brute_gemini)

    # 1. Chercher un bloc JSON marqué par ```json ... ```
    match_json_block = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", reponse_brute_gemini)
    if match_json_block:
        json_str = match_json_block.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Erreur de décodage JSON (bloc ```json): {e}\nContenu du bloc: '{json_str}'")

    # 2. Chercher un bloc JSON générique marqué par ``` ... ```
    match_generic_block = re.search(r"```\s*(\{[\s\S]*?\})\s*```", reponse_brute_gemini)
    if match_generic_block:
        json_str = match_generic_block.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Erreur de décodage JSON (bloc ```): {e}\nContenu du bloc: '{json_str}'")

    # 3. Essayer de trouver un objet JSON brut
    try:
        start_index = reponse_brute_gemini.find('{')
        end_index = reponse_brute_gemini.rfind('}')

        if start_index != -1 and end_index != -1 and end_index > start_index:
            potential_json_str = reponse_brute_gemini[start_index : end_index + 1]
            parsed_json = json.loads(potential_json_str)
            if isinstance(parsed_json, dict):
                return parsed_json
            elif not match_json_block and not match_generic_block:
                print(f"JSON brut trouvé mais ce n'est pas un objet (dict): {type(parsed_json)}")
        elif not match_json_block and not match_generic_block:
            print("Aucun bloc JSON (```json ou ```) ou accolades valides trouvés pour un JSON brut.")
    except json.JSONDecodeError as e:
        if not match_json_block and not match_generic_block:
            if 'potential_json_str' in locals():
                 print(f"Erreur de décodage JSON (extraction brute) : {e}\nChaîne testée: '{potential_json_str}'")
            else:
                 print(f"Erreur de décodage JSON (extraction brute) : {e}")
    except Exception as ex:
        print(f"Erreur inattendue lors de l'extraction du JSON brut : {ex}")

    return None

def appeler_gemini_freeform(prompt: str) -> str:
    """
    Envoie un prompt libre à Gemini et retourne la réponse brute (texte).
    """
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

# --- Exemple d'utilisation ---
if __name__ == "__main__":
    # Assurez-vous que votre fichier .env est correctement configuré
    # avec GOOGLE_API_KEY, PROMPT_PART1, et PROMPT_PART2.

    texte_exemple_tweet = "Returning to Bluesky after some time away. Who are the best people to follow these days? Especially eager to find folks sharing math, programming, design, science and long form links"
    # texte_exemple_tweet = "Just saw the latest budget proposal from the government, looks like taxes on candy are going up! #politics #budget2025"


    print(f"Texte utilisateur (tweet) à envoyer : \"{texte_exemple_tweet}\"")
    print("\nAppel de la fonction appeler_gemini...\n")

    reponse_brute = appeler_gemini(texte_exemple_tweet)

    print("\nRéponse BRUTE de Gemini:")
    print("---------------------")
    print(reponse_brute)
    print("---------------------\n")

    if "Erreur" not in reponse_brute: # Simple vérification pour ne pas essayer de parser un message d'erreur
        json_analyse = extraire_json_de_reponse(reponse_brute)

        if json_analyse:
            print("JSON FINAL Extrait et Parsé ✨:")
            print("---------------------------------")
            # Affiche le JSON de manière lisible (pretty print)
            print(json.dumps(json_analyse, indent=2, ensure_ascii=False))
            print("---------------------------------")

            # Vous pouvez maintenant accéder aux éléments du JSON :
            is_political = json_analyse.get("isPolitical")
            emotions = json_analyse.get("emotions", []) # Fournit une liste vide si la clé n'existe pas

            print(f"\nAnalyse du Tweet :")
            print(f"  Est politique : {is_political}")
            print(f"  Émotions détectées : {', '.join(emotions) if emotions else 'Aucune'}")

            if json_analyse.get("potentialFakeNews"):
                print(f"  Potentiel Fake News : Oui")
                print(f"  Justification : {json_analyse.get('fakeNewsJustification', 'Non fournie')}")
            else:
                print(f"  Potentiel Fake News : Non")
        else:
            print("Aucun JSON valide n'a pu être extrait de la réponse de Gemini.")
    else:
        print("L'appel à Gemini a retourné une erreur, pas d'extraction JSON tentée.")