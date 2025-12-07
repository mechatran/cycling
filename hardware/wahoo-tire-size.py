#!/usr/bin/env python3 -B

import re
import sys

info = []

heading_found = False
for line in sys.stdin:
    #sys.stderr.write(line)
    line = line.rstrip()
    if len(line) == 0:
        continue
    if not heading_found:
        heading_found = True
        continue
    fields = line.split("\t")
    if len(fields) != 3:
        sys.exit("Bad line")
    nominal = fields[0].strip()
    if nominal == '26" x 7/8" Tubular':
        # Match Cateye nomenclature
        nominal = "650C Tubular 26x7/8"
    else:
        # Match Cateye formatting
        nominal = re.sub(r'"', r'', nominal)
        nominal = re.sub(r" x ", r"x", nominal)
        nominal = re.sub(r"27\.5 / 650B", r"27.5", nominal)
    info.append({
            "nominal": nominal,
            "etrto": fields[1].strip(),
            "circMm": int(fields[2].strip()),
            })

sys.stdout.write("// Generated from https://support.wahoofitness.com/hc/en-us/articles/115000738484-Tire-Size-Wheel-Circumference-Chart\n")
sys.stdout.write("WAHOO_TIRE_SIZE_INFO = [\n")
for row in info:
    if len(row["etrto"]):
        etrto = f'etrto: "{row["etrto"]}",'
    else:
        etrto = ""
    nominal_value = f'"{row["nominal"]}",'
    nominal = f"nominal: {nominal_value}"
    sys.stdout.write(f'  {{ {etrto:17}{nominal:32}circMm: {row["circMm"]} }},\n')
sys.stdout.write("];\n")

