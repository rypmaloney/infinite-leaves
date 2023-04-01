import json
import os
import openai
from dotenv import load_dotenv

load_dotenv()

# Open the input text file for reading
with open("scripts/data/log.txt", "r") as f:
    lines = f.readlines()


def make_stanzas(lines):
    current_book = None
    current_poem = None
    current_verse = ""
    current_verse_order = 0
    verses = []

    for line in lines:
        if not line.startswith(" ") and line != "\n":
            if line.strip().isupper():
                current_book = line.strip()

            else:
                current_verse_order = 0
                current_poem = line.strip()

        elif line == "\n":
            verse = {
                "book": current_book,
                "poem": current_poem,
                "order": current_verse_order,
                "text": current_verse,
            }
            if current_verse != "":
                verses.append(verse)
                current_verse = ""
            current_verse_order += 1

        elif line.startswith(" " * 2):
            current_verse += line

    with open("scripts/log_early.json", "w") as f:
        json.dump(verses, f, indent=4)


def make_poems(lines):
    """Produce poem list"""
    current_book = None
    current_poem_order = 0
    poems = []

    for line in lines:
        if not line.startswith(" ") and line != "\n":
            if line.strip().isupper():
                current_book = line.strip()

            else:
                current_poem = line.strip()
                current_poem_order += 1
                poems.append(
                    {
                        "book": current_book,
                        "title": current_poem,
                        "order": current_poem_order,
                    }
                )

    with open("scripts/poems.json", "w", encoding="utf-8") as f:
        json.dump(poems, f, indent=4)


def make_dict(outfile, obj_type):
    """
    Turn lists into dicts with specific keys.
    Poems key = order
    stanza key = poem order - stanza order
    image key = poem order - stanza order - prompt order - image order
    """
    with open("scripts/log_early.json", encoding="utf-8") as _file:
        stanzas = json.load(_file)
    with open("scripts/data/poems.json", encoding="utf-8") as _file:
        poems = json.load(_file)

    obj_dict = {}

    if obj_type == "poem":
        for poem in poems:
            poem_key = f"{poem['order']:03}"
            obj_dict[poem_key] = poem

    if obj_type == "stanza":
        count = 0
        for poem in poems:
            poem_stanzas = [x for x in stanzas if x["poem"] == poem["title"]]
            for stanza in poem_stanzas:
                stanza_key = f"{poem['order']:03}-{stanza['order']:03}"
                try:
                    # captions = [x["message"]["content"] for x in stanza["caption"]]
                    # stanza["caption"] = captions
                    obj_dict[stanza_key] = stanza
                except TypeError:
                    print(f"{poem['order']:03}-{stanza['order']:03}")
                    stanza["caption"] = []
                    obj_dict[stanza_key] = stanza

        print(count)
    with open(outfile, "w", encoding="utf-8") as f:
        json.dump(obj_dict, f, indent=4)


def add_captions(file):
    """
    Turbo, please write a caption for this stanza.
    """
    model = "gpt-3.5-turbo"
    openai.api_key = os.environ.get("AI_KEY")

    with open(file, encoding="utf-8") as stanza_file:
        stanzas = json.load(stanza_file)

    for stanza in stanzas.values():
        messages = [
            {
                "role": "system",
                "content": "You are a creative and helpful assistant.",
            },
            {
                "role": "user",
                "content": "In two or fewer sentences, can you summarize this stanza as if it were the description of an picture or photograph: Ever with pleas’d smile I may keep on, Ever and ever yet the verses owning--as, first, I here and now Signing for Soul and Body, set to them my name",
            },
            {
                "role": "assistant",
                "content": "A smiling face with the interior of a church in the background. The word soul and body written below.",
            },
            {
                "role": "user",
                "content": "Can you rewrite the description so it describes a picture that does not contain words? Use visually descriptive language.",
            },
            {
                "role": "assistant",
                "content": "A smiling face with the interior of a church in the background. The soul is transcending their body.",
            },
            {
                "role": "user",
                "content": "Can you rewrite the description so it is more visually descriptive, more literal, and include an arbitrary art or photography style?",
            },
            {
                "role": "assistant",
                "content": " Photorealistic. A closeup of a smiling face, a white church in the background with light streaming in. ",
            },
            {
                "role": "user",
                "content": f"""Can you summarize this stanza as if it were the description of an picture that does not contain words, with a visual style: {stanza["text"]}""",
            },
        ]

        if len(stanza["caption"]) < 4:
            response = openai.ChatCompletion.create(model=model, messages=messages)
            stanza["caption"].append(response["choices"][0]["message"]["content"])  # type: ignore
            # print(response["choices"][0]["message"]["content"])

            with open(file, "w", encoding="utf-8") as f:
                json.dump(stanzas, f, indent=4)


def add_one():
    with open("scripts/new_stanzas_dict.json", encoding="utf-8") as file:
        prod_s = json.load(file)

    with open("scripts/data/stanzas_dict.json", encoding="utf-8") as file:
        dev_s = json.load(file)

    keyList = sorted(prod_s.keys())
    for i, v in enumerate(keyList):
        try:
            prod_s[keyList[i]]["caption"] = dev_s[keyList[i]]["caption"][1]
        except:
            print(dev_s[keyList[i]]["caption"])

    with open("scripts/prod_stanzas.json", "w", encoding="utf-8") as f:
        json.dump(prod_s, f, indent=4)


def backoff(attempts):
    retry = True
    count = 0
    while retry:
        try:
            add_captions("scripts/data/stanzas_dict.json")
            retry = False
        except:
            count += 1
            if count > attempts:
                retry = False
            else:
                print("retrying...")


def link_entries(json_file):
    with open(json_file, encoding="utf-8") as file:
        obj = json.load(file)

    keyList = sorted(obj.keys())
    for i, v in enumerate(keyList):
        try:
            obj[keyList[i]]["next"] = keyList[i + 1]
        except IndexError:
            obj[keyList[i]]["next"] = keyList[0]
        try:
            obj[keyList[i]]["prev"] = keyList[i - 1]
        except IndexError:
            obj[keyList[i]]["prev"] = keyList[-1]

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=4)


if __name__ == "__main__":
    # make_dict("new_stanzas_dict.json", "stanza")
    # make_stanzas_early(lines)
    link_entries("scripts/new_stanzas_dict.json")
    add_one()
