import json
import re


# Open the input text file for reading
with open('scripts/log.txt', 'r') as f:
    lines = f.readlines()



def make_stanzas(lines):
    current_book = None
    current_poem = None
    current_verse = ''
    current_verse_order = 0
    verses = []

    for line in lines:
        if not line.startswith(' ') and line != '\n':
            if line.strip().isupper():
                current_book = line.strip()

            else:
                current_verse_order = 0
                current_poem = line.strip()

        elif line == '\n':
            verse = {
                'book': current_book,
                'poem': current_poem,
                'order': current_verse_order,
                'text': current_verse
            }
            if current_verse != '':
                verses.append(verse)
                current_verse = ''
            current_verse_order += 1


        elif line.startswith(' ' * 2):
            current_verse += line.strip()

    with open('scripts/log.json', 'w') as f:
        json.dump(verses, f, indent=4)

def make_poems(lines):
    current_book = None
    current_poem_order = 0
    poems = []

    for line in lines:
        if not line.startswith(' ') and line != '\n':
            if line.strip().isupper():
                current_book = line.strip()

            else:
                current_poem = line.strip()
                current_poem_order += 1
                poems.append({
                    "book": current_book,
                    "title": current_poem,
                    "order": current_poem_order
                })

    with open('scripts/poems.json', 'w') as f:
        json.dump(poems, f, indent=4)


if __name__ == "__main__":
    make_poems(lines)