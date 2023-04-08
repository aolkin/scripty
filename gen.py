"""
sp = re.compile(r'(?P<chr>[A-Z][A-Z0-9# .]+)\. ',re.DOTALL)
t = sp.split(text.replace("\n"," "))
lines = []
for i in range(1,len(t)-1,2):
    lines.append((t[i],t[i+1].strip()))
"""

import json, sys
from subprocess import run

fd = open(sys.argv[1])
lines = json.load(fd)

for i, line in enumerate(lines):
    voice = "Daniel"
    if line[0].upper() in ["STAGE DIRECTIONS", "SCENE"]:
        voice = "Reed"
    run("say -v {} -o {:04}.aac".format(voice,i),input=line[1],shell=True,universal_newlines=True)
