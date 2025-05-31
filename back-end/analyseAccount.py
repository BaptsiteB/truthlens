from getPost import get_authenticated_bluesky_posts
from gemini import appeler_gemini, extraire_json_de_reponse, appeler_gemini_freeform
import random
from collections import Counter
import json

def analyse_bluesky_account(target_handle, sample_size=50, fetch_limit=50):
    posts = get_authenticated_bluesky_posts(target_handle, limit=fetch_limit)
    if len(posts) > sample_size:
        sampled_posts = random.sample(posts, sample_size)
    else:
        sampled_posts = posts

    fake_news_percentages = []
    fake_news_justifications = []
    emotions_counter = Counter()
    political_count = 0
    factual_count = 0
    analysed_count = 0
    posts_texts = []

    for post in sampled_posts:
        try:
            text = post.post.record.text
        except AttributeError:
            text = ''
        if not text:
            continue
        try:
            output = extraire_json_de_reponse(appeler_gemini(text))
        except Exception:
            continue
        if not output:
            continue
        posts_texts.append(text)
        analysed_count += 1
        fake_news_percentages.append(output.get('percentageFakeNews', 0))
        if output.get('fakeNewsJustification'):
            fake_news_justifications.append(output['fakeNewsJustification'])
        emotions = output.get('emotions', [])
        emotions_counter.update(emotions)
        if output.get('isPolitical', False):
            political_count += 1
        if output.get('containsFactualInformation', False):
            factual_count += 1

    avg_fake_news = sum(fake_news_percentages) / len(fake_news_percentages) if fake_news_percentages else 0
    most_common_emotions = [e for e, _ in emotions_counter.most_common(5)]
    political_ratio = political_count / analysed_count if analysed_count else 0
    factual_ratio = factual_count / analysed_count if analysed_count else 0

    if posts_texts:
        joined_text = '\n'.join(posts_texts[:50])
        prompt = (
            "Here is a list of posts from a Bluesky account. "
            "In 2 or 3 short sentences, simply summarize in English the main topics or themes this account talks about. "
            "Do not use bullet points or lists. Be brief, clear, and avoid details.\n\n"
            + joined_text
        )
        topic_summary = appeler_gemini_freeform(prompt).strip()
    else:
        topic_summary = "No text to analyze."

    result_json = {
        "profile": target_handle,
        "total_posts_analyzed": analysed_count,
        "average_fake_news_percentage": avg_fake_news,
        "most_common_emotions": most_common_emotions,
        "proportion_political_posts": political_ratio,
        "proportion_factual_posts": factual_ratio,
        "topic_summary": topic_summary
    }
    return result_json

if __name__ == "__main__":
    # Exemple d'utilisation
    res = analyse_bluesky_account("mcuban.bsky.social", sample_size=10, fetch_limit=20)
    print(json.dumps(res, indent=2, ensure_ascii=False))
