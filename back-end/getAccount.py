import sys
from getPost import get_all_bluesky_posts_for_user
from gemini import appeler_gemini, extraire_json_de_reponse
import json
from collections import Counter, defaultdict

# Helper: Analyze a single post (text)
def analyse_post_text(post_text):
    output = extraire_json_de_reponse(appeler_gemini(post_text))
    if not output:
        return None
    return output

# Helper: Summarize topics using Gemini
def summarize_topics(posts_texts):
    joined_text = '\n'.join(posts_texts[:50])  # Limit to first 50 posts for prompt size
    prompt = (
        "Voici une liste de publications d'un compte Bluesky. Résume en quelques phrases les principaux sujets abordés par ce compte. "
        "Indique si c'est un compte tech, politique, personnel, etc. et donne quelques exemples de thèmes ou mots-clés récurrents.\n\n" + joined_text
    )
    summary = appeler_gemini(prompt)
    return summary.strip()

def main():
    if len(sys.argv) < 2:
        print("Usage: python analyseAccount.py <bluesky_profile_url>")
        sys.exit(1)
    profile_url = sys.argv[1]
    print(f"Fetching posts for: {profile_url}")
    posts = get_all_bluesky_posts_for_user(profile_url)
    if not posts:
        print("No posts found or error fetching posts.")
        sys.exit(1)
    print(f"Fetched {len(posts)} posts. Analyzing...")
    # Aggregate data
    fake_news_percentages = []
    fake_news_justifications = []
    emotions_counter = Counter()
    political_count = 0
    factual_count = 0
    analysed_count = 0
    posts_texts = []
    for post in posts:
        post_text = post.get('value', {}).get('text', '')
        if not post_text:
            continue
        posts_texts.append(post_text)
        result = analyse_post_text(post_text)
        if not result:
            continue
        analysed_count += 1
        # Fake news
        fake_news_percentages.append(result.get('percentageFakeNews', 0))
        if result.get('fakeNewsJustification'):
            fake_news_justifications.append(result['fakeNewsJustification'])
        # Emotions
        emotions = result.get('emotions', [])
        emotions_counter.update(emotions)
        # Political/factual
        if result.get('isPolitical', False):
            political_count += 1
        if result.get('containsFactualInformation', False):
            factual_count += 1
    # Summary stats
    avg_fake_news = sum(fake_news_percentages) / len(fake_news_percentages) if fake_news_percentages else 0
    most_common_emotions = emotions_counter.most_common(5)
    political_ratio = political_count / analysed_count if analysed_count else 0
    factual_ratio = factual_count / analysed_count if analysed_count else 0
    # Topic summary
    topic_summary = summarize_topics(posts_texts)
    # Print summary
    print("\n===== Account Analysis Summary =====")
    print(f"Profile: {profile_url}")
    print(f"Total posts analyzed: {analysed_count}")
    print(f"Average fake news percentage: {avg_fake_news:.2f}%")
    print(f"Most common emotions: {most_common_emotions}")
    print(f"Proportion of political posts: {political_ratio:.2%}")
    print(f"Proportion of factual posts: {factual_ratio:.2%}")
    print(f"\nSome fake news justifications:")
    for just in fake_news_justifications[:5]:
        print(f"- {just}")
    print(f"\nSummary of what the user talks about:")
    print(topic_summary)

if __name__ == "__main__":
    main() 