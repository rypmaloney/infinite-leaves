import subprocess
import json

from tqdm import tqdm


def create_image(prompt, filename, amount):
    """
    Run in Stable Diffusion scripts directory.
    """

    script_path = "scripts/txt2img.py"

    args = [
        "--prompt",
        prompt,
        "--outdir",
        "/path/to/images",
        "--filename",
        filename,
        "--n_samples",
        str(amount),
        "--n_iter",
        "1",
        "--skip_grid",
        "--plms",
    ]

    command = ["python", script_path] + args

    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    # Wait for the command to complete
    stdout, stderr = process.communicate()


def create_image_object(prompt, prompt_filename, image_json, amount):
    """
    Creates an image json object to correspond with each image file.
    """

    with open(image_json, encoding="utf-8") as i_file:
        img_obj = json.load(i_file)

    for i in range(amount):
        i_id = f"{prompt_filename}-{i:02}"  # poem_id-img_id-prompt_order-image_order
        stanza = prompt_filename
        img_obj[i_id] = {
            "_id": i_id,
            "filename": f"{i_id}.png",
            "stanza": stanza,
            "prompt": prompt,
        }
    with open(image_json, "w") as f:
        json.dump(img_obj, f, indent=4)


def create_new_images(stanza_file, image_json, prompt_order, amount):
    with open(image_json, encoding="utf-8") as i_file:
        img_obj = json.load(i_file)

    with open(stanza_file, encoding="utf-8") as s_file:
        stanzas = json.load(s_file)

    for key in tqdm(stanzas.keys()):
        obj = stanzas[key]

        try:
            prompt = obj["caption"][prompt_order]
            filename = (
                f"{key}-{prompt_order:02}"  # poem_id-img_id-prompt_order-image_order
            )

            if f"{filename}-00" not in img_obj:  # no image generated yet
                create_image(prompt, filename, amount)
                create_image_object(prompt, filename, image_json, amount)

        except Exception as e:
            print(e)
            break


if __name__ == "__main__":
    create_new_images("/path/to/stanzas_dict.json", "/path/to/images.json", 1, 1)
    # Make stanzas images, make images objects, second prompt, one images each
