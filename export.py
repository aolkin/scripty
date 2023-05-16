import json, sys, html

with open(sys.argv[1]) as fd:
    script = json.load(fd)

character = "UNKNOWN"
lines = []

for i in script:
    text = html.unescape(i.get("text", ""))
    if i.get("class","") in ["c5", "c3"]:
        character = text or "UNKNOWN"
    elif i.get("class", "") in ["c7", "c10", "c18", "c16"]:
        lines.append(["STAGE DIRECTIONS", text])
    elif i.get("class", "") in ["c8", "c17"]:
        lines.append(["SCENE", text])
    else:
        lines.append([character, text])

with open(sys.argv[2], "w") as fd:
    json.dump(lines, fd)
