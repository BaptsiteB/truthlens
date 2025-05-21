from getPost import get_bluesky_post_info as getPost
from gemini import appeler_gemini, extraire_json_de_reponse

url = "https://bsky.app/profile/zoink.bsky.social/post/3l6xcs2mynp2t"
fullpost = getPost(url)

post = fullpost['value']['text']
created_at = fullpost['value']['createdAt']
author = url.split('/')[4]

print(extraire_json_de_reponse(appeler_gemini(post)))