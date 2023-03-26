import os
import json

from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()


def insert():
    URI = os.environ.get('DB_URI')
    print(URI)
    client = MongoClient(URI);
    log_db = client["log"]
    stanza_collection = log_db["stanzas"]
    test = stanza_collection.insert_one({
        "text":"Test text" })
    print(test.inserted_id)
    client.close();


def main():
    with open('poems.json') as poem_file:
        poems = json.load(poem_file)

    with open('log.json') as stanza_file:
        stanzas = json.load(stanza_file)


    for poem in poems:
        poem_stanzas = [x for x in stanzas if x["poem"] == poem["title"]]



if __name__ == "__main__":
    main()