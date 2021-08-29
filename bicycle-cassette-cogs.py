#!/usr/bin/env python3 -B

import re
import sys

info = {}

group = 0
brand = ""
sprockets = []
for line in sys.stdin:
    #sys.stdout.write(line)
    line = line.rstrip()
    if len(line) == 0:
        continue
    fields = line.split("\t")
    if len(fields) == 1:
        match = re.match(r"(\d+)-speed", fields[0])
        if match:
            group = int(match.group(1))
        else:
            sys.exit("Bad group line")
        continue
    elif len(fields) == 2:
        brand = fields[1]
        continue
    elif len(fields) >= 3:
        sprockets = fields[3].split("-")
    else:
        sys.exit("Bad line")
    if group not in info:
        info[group] = []
    info[group].append(
        {
            "brand": brand,
            "sprockets": sprockets,
        })

sys.stdout.write("// Generated from http://photos.airpost.net/cycling/bicycle-cassette-cogs.xls\n")
sys.stdout.write("// As found at https://www.sheldonbrown.com/gear-calc.html\n")
sys.stdout.write("PETER_HEINLE_INFO = [\n")
for k in sorted(info.keys()):
    sys.stdout.write((
            "  {\n" +
            "    group: %d,\n" +
            "    infos: [\n") % k)
    for v in sorted(info[k], key=lambda x: x["brand"] + "-".join(x["sprockets"])):
        sys.stdout.write(
            "      { brand: \"%s\", sprockets: [%s] },\n" % (v["brand"], ", ".join(v["sprockets"])))
    sys.stdout.write(
            "    ]\n" +
            "  },\n")
sys.stdout.write("];\n")
