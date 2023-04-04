import os
import json

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


def main():
    """Populate Atlas cluster with production stanzas"""
    with open("scripts/data/prod_stanzas_03.json", encoding="utf-8") as stanza_file:
        stanzas = json.load(stanza_file)

    URI = os.environ.get("DB_URI")
    client = MongoClient(URI)
    log_db = client["log"]
    stanza_collection = log_db["stanzas"]

    for k in stanzas.keys():
        stanzas[k]["key"] = k
        obj = stanza_collection.insert_one(stanzas[k])
        print(obj.inserted_id)

    client.close()


if __name__ == "__main__":
    main()
