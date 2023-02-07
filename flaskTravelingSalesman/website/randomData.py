import requests
import random

word_url = 'https://itoven-ai.co/images/words.txt'
word_request = requests.get(word_url, allow_redirects=True)


def getRandomWord():
    return random.choice(word_request.text.split("\n"))


def getRandomName():
    word = getRandomWord()
    number = random.randrange(99999)
    return "".join(x for x in list(f"{word}"+str(number)))


print(getRandomName())