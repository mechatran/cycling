/*
 * https://bicycles.meta.stackexchange.com/a/1180
 *
 * Technically... cogs are the teeth on a sprocket or gear. But the word also
 * means "cogwheel".
 *
 * A cogwheel is... basically any wheel with teeth (cogs).
 *
 * A gear is a wheel with cogs that mesh with the gears of another wheel.
 *
 * A sprocket is a wheel with cogs that mesh with a chain (or belt or tape or film
 * or whatever). Just like a pulley, but with teeth that mesh somehow.
 *
 * A typical bicycle doesn't have any gears on it, just cogwheels that are
 * sprockets.
 */

/*
 * https://sheldonbrown.com/gloss_cn-z.html#cog
 *
 * Cog
 *
 * Popular term for a rear sprocket. Sometimes incorrectly used as a synonym
 * for cluster, which is actually a group of cogs.
 *
 * Originally, "cog" referred to just a single tooth on a "cog wheel." Then
 * "cog wheel" was shortened by popular usage to "cog."
 * 
 * https://sheldonbrown.com/gloss_sp-ss.html#sprocket
 *
 * Sprocket
 *
 * A toothed wheel or gear that is part of a chain drive.
 *
 * The front sprockets are also commonly called chainwheels or chainrings. The
 * term "sprocket" is perfectly correct to refer to either front or rear, but
 * most adult cyclists use this term mainly to refer to the rear sprockets. The
 * use of "sprocket" to refer specifically to a chainwheel is mainly confined
 * to BMX usage.
 *
 * The rear sprockets individually are also commonly called cogs or gears; as a
 * group they are referred to as a block, cassette, cluster or freewheel.
 *
 * https://sheldonbrown.com/gloss_cl.html#cluster
 *
 * Cluster
 *
 * A group of rear sprockets on a multi-speed bicycle. If the bicycle uses a
 * thread-on freewheel, the term "cluster" describes the entire assembly
 * including the freewheel mechanism. In the case of a cassette hub, the
 * "cluster" consists of the sprockets and the spacers that separate them.
 */

//////////////////////////////////////////////////////////////////////////////

var CHAINRINGS_INFO = [
  {
    group: 1,
    infos: [
      {
        brand: "Race Face",
        models: [
          { sprockets: [24] },
          { sprockets: [26] },
          { sprockets: [28] },
        ],
      },
      {
        brand: "Shimano",
        models: [
          { model: "XTR M9100",  sprockets: [30] },
          { model: "XTR M9100",  sprockets: [32] },
          { model: "XTR M9100",  sprockets: [34] },
          { model: "XTR M9100",  sprockets: [36] },
          { model: "XTR M9100",  sprockets: [38] },
        ],
      },
      {
        brand: "SRAM",
        models: [
          { model: "Force 1",    sprockets: [40] },
          { model: "S350",       sprockets: [42] },
        ],
      },
      {
        brand: "Woom",
        models: [
          { sprockets: [25] },
        ],
      },
      {
        brand: "Unbranded",
        models: [
          { sprockets: [36] },
          { sprockets: [40] },
        ],
      },
    ]
  },
  {
    group: 2,
    infos: [
      {
        brand: "Absolute Black",
        models: [
          { model: "Oval", sprockets: [46, 30] },
          { model: "Oval", sprockets: [48, 32] },
        ],
      },
      {
        brand: "Campagnolo",
        models: [
          { model: "Veloce", sprockets: [50, 34] },
        ],
      },
      {
        brand: "Easton",
        models: [
          { model: "EC90SL", sprockets: [46, 30] },
        ],
      },
      {
        brand: "FSA",
        models: [
          { model: "Comet",    sprockets: [36, 22] },
          { model: "Powerbox", sprockets: [46, 30] },
        ],
      },
      {
        brand: "Rotor",
        models: [
          { sprockets: [46, 30] },
          { sprockets: [48, 32] },
        ],
      },
      {
        brand: "Shimano",
        models: [
          { model: "Claris",               sprockets: [50, 34] },
          { model: "Tiagra",               sprockets: [50, 34] },
          { model: "105",                  sprockets: [50, 34] },
          { model: "Ultegra",              sprockets: [46, 36] },
          { model: "Ultegra",              sprockets: [50, 34] },
          { model: "Ultegra",              sprockets: [52, 36] },
          { model: "Ultegra",              sprockets: [53, 39] },
          { model: "Dura-Ace",             sprockets: [50, 34] },
          { model: "GRX-810",              sprockets: [48, 31] },
          { model: "SLX M7000",            sprockets: [34, 24] },
          { model: "SLX M7000",            sprockets: [36, 26] },
          { model: "SLX M7000",            sprockets: [38, 28] },
          { model: "Deore XT M8000",       sprockets: [34, 24] },
          { model: "Deore XT M8000",       sprockets: [36, 26] },
          { model: "Deore XT M8000",       sprockets: [38, 28] },
          { model: "(DIY) Ultegra",        sprockets: [46, 34] },
          { model: "(DIY) Ultegra",        sprockets: [50, 36] },
          { model: "(DIY) Deore XT M8000", sprockets: [34, 22] },
          { model: "(DIY) Deore XT M8000", sprockets: [34, 26] },
        ],
      },
      {
        brand: "Unbranded",
        models: [
          { sprockets: [50, 34] },
        ],
      },
    ]
  },
  {
    group: 3,
    infos: [
      {
        brand: "Shimano",
        models: [
          { model: "Claris",         sprockets: [50, 39, 30] },
          { model: "Tiagra",         sprockets: [50, 39, 30] },
          { model: "Acera FC-M361",  sprockets: [42, 32, 22] },
          { model: "Deore XT M8000", sprockets: [40, 30, 22] },
        ]
      },
      {
        brand: "Suntour",
        models: [
          { sprockets: [48, 38, 28] },
        ]
      },
      {
        brand: "Unbranded",
        models: [
          { sprockets: [48, 38, 28] },
        ]
      },
    ]
  },
];

//////////////////////////////////////////////////////////////////////////////

var CLUSTERS_INFO = [
  {
    group: 1,
    infos: [
      {
        brand: "Woom",
        models: [
          { sprockets: [16] },
        ]
      },
    ]
  },
  {
    group: 6,
    infos: [
      {
        brand: "Epoch",
        models: [
          { sprockets: [14, 17, 19, 22, 24, 28], url: "https://www.santafixie.com/en/epoch-6-speed-14-28-freewheel.html" },
        ]
      },
      {
        brand: "Shimano",
        models: [
          { model: "MF-TZ500-6", sprockets: [14, 16, 18, 21, 24, 28] },
        ]
      },
    ]
  },
  {
    group: 7,
    infos: [
      {
        brand: "Epoch",
        models: [
          { sprockets: [11, 13, 15, 18, 21, 24, 28] },
          { sprockets: [14, 16, 18, 20, 22, 24, 32] },
        ]
      },
      {
        brand: "Shimano",
        models: [
          { model: "MF-HG37",    sprockets: [13, 15, 17, 19, 21, 24, 28] },
          { model: "MF-TZ2",     sprockets: [14, 15, 17, 19, 21, 24, 28] },
          { model: "MF-TZ500-7", sprockets: [14, 16, 18, 20, 22, 24, 34] },
        ]
      },
      {
        brand: "SunRace",
        models: [
          { sprockets: [13, 15, 17, 19, 21, 24, 28] },
        ]
      },
    ]
  },
  {
    group: 8,
    infos: [
      {
        brand: "Shimano",
        models: [
          { model: "Sora CS-HG50",        sprockets: [11, 13, 15, 18, 21, 24, 28, 34] },
          { model: "Sora CS-HG50-8 (an)", sprockets: [11, 13, 15, 17, 20, 23, 26, 30] },
          { model: "Sora CS-HG50-8 (aw)", sprockets: [11, 13, 15, 18, 21, 24, 28, 32] },
          { model: "Sora CS-HG50-8 (bf)", sprockets: [11, 13, 15, 17, 19, 21, 24, 28], url: "http://si.shimano.com/pdfs/ev/EV-CS-HG50-8-3072B.pdf" },
          { model: "Sora CS-HG50-8 (S)",  sprockets: [12, 13, 14, 15, 16, 17, 19, 21] },
          { model: "Sora CS-HG50-8 (T)",  sprockets: [13, 14, 15, 16, 17, 19, 21, 23], grams: 300 },
          { model: "Sora CS-HG50-8 (U)",  sprockets: [12, 13, 14, 15, 17, 19, 21, 23] },
          { model: "Sora CS-HG50-8 (V)",  sprockets: [13, 14, 15, 17, 19, 21, 23, 26] },
          { model: "Sora CS-HG50-8 (W)",  sprockets: [12, 13, 15, 17, 19, 21, 23, 25] },
          { model: "Altus CS-HG31",       sprockets: [11, 13, 15, 18, 21, 24, 28, 32] },
          { model: "Altus HG31",          sprockets: [11, 13, 15, 17, 20, 23, 26, 34] },
          { model: "XTR",                 sprockets: [11, 12, 14, 16, 18, 21, 24, 28] },
          { model: "XTR",                 sprockets: [12, 13, 14, 16, 18, 21, 24, 28] },
        ]
      },
      {
        brand: "SunRace",
        models: [
          { model: "CSM66",      sprockets: [12, 14, 16, 18, 21, 24, 28, 34] },
          { model: "CSM680 8AX", sprockets: [11, 13, 15, 18, 22, 28, 34, 40] },
          { model: "Freewheel",  sprockets: [13, 15, 17, 19, 22, 25, 28, 34] },
        ]
      },
    ]
  },
  {
    group: 9,
    infos: [
      {
        brand: "Shimano",
        models: [
          { model: "Sora", sprockets: [11, 12, 14, 16, 18, 21, 24, 28, 32] },
        ]
      },
    ]
  },
  {
    group: 10,
    infos: [
      {
        brand: "Campagnolo",
        models: [
          { model: "Veloce",  sprockets: [13, 14, 15, 16, 17, 19, 21, 23, 26, 29], url: "https://www.campagnolo.com/media/files/035_221_Technical%20manual%20-%20sprocket%20pack%20-%20Campagnolo_REV00__09_14.pdf" },
        ]
      },
      {
        brand: "Shimano",
        models: [
          { model: "Tiagra",  sprockets: [11, 12, 14, 16, 18, 20, 22, 25, 28, 32] },
          { model: "Tiagra",  sprockets: [11, 13, 15, 17, 19, 21, 23, 26, 30, 34] },
          { model: "Tiagra",  sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 28] },
          { model: "Tiagra",  sprockets: [12, 13, 14, 15, 17, 19, 21, 24, 27, 30] },
          { model: "Ultegra", sprockets: [13, 14, 15, 16, 17, 18, 19, 21, 23, 25] },
          { model: "Ultegra", sprockets: [14, 15, 16, 17, 18, 19, 20, 21, 23, 25] },
          { model: "Ultegra", sprockets: [16, 17, 18, 19, 20, 21, 22, 23, 25, 27] },
        ]
      },
    ]
  },
  {
    group: 11,
    infos: [
      {
        brand: "IRD",
        models: [
          { sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 27, 30], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
          { sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
          { sprockets: [12, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
        ]
      },
      {
        brand: "Relic MTB",
        models: [
          { sprockets: [11, 12, 13, 14, 16, 19, 21, 23, 25, 28, 40], url: "http://www.relicmtb.com/PRODUCTS/r40t-sprocket/",
             clocking: " *   *   *   *   +   *---*   *---*---*   +" },
        ]
      },
      {
        brand: "Shimano",
        models: [
          { model: "105 CS-R7000",      sprockets: [11, 12, 13, 14, 16, 18, 20, 22, 25, 28, 32], grams:320 },
          { model: "Ultegra CS-6800",   sprockets: [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23] },
          { model: "Ultegra CS-HG800",  sprockets: [11, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34], grams: 335, url: "http://www.cyclingforum.com/phpBB2/viewtopic.php?t=12012",
                                         clocking: " B   C   C   E   H   J---D---D   E---B---A" },
          { model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25],
                                         clocking: " *   *   *   *   *   *   *---*   *---*---*" },
          { model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28], grams: 249,
                                         clocking: " A   A   A   A   A   B   C---C   C---B---A" },
          { model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], grams: 271 },
          { model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 16, 18, 20, 22, 25, 28, 32], grams: 281,
                                         clocking: " A   A   A   A   B   C   A---A   C---B---A" },
          { model: "Ultegra CS-R8000",  sprockets: [12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 25],
                                         clocking: " A   A   A   A   A   C   B---D   B---B---A" },
          { model: "Ultegra CS-R8000",  sprockets: [14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 28],
                                         clocking: " B   B   A   C   D   F   C---E   C---B---A" },
          { model: "Dura-Ace CS-R9100", sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], grams: 209,
                                         clocking: " A   A   A   A   A   B   C---C---A   A---A" },
          { model: "Dura-Ace CS-R9100", sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28],
                                         clocking: " B   B   A   A   A   C   C---C---C   B---A" },
          { model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 27, 31, 35, 40], grams: 411,
                                         clocking: " *   *   *   *   *   *---*---*   *---*---*" },
          { model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 28, 32, 37, 42], grams: 434,
                                         clocking: " *   *   *   *   *   *---*---*   *---*---*" },
          { model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 28, 32, 37, 46] },
          { model: "XTR CS-M9001",      sprockets: [11, 13, 15, 17, 19, 21, 24, 27, 31, 35, 40], grams: 330 },
          { model: "(DIY) Ultegra",     sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28], note: "DIY version of 12-28T (11psd) Shimano Dura-Ace CS-R9100",
                                         clocking: " *   *   *   *   *   *   *---*   *---*---*" },
          { model: "(DIY) Ultegra",     sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 24, 27, 30],
                                         clocking: " *   *   *   *   *   *   *---*   *---*---*" },
          { model: "(DIY) Ultegra",     sprockets: [14, 15, 16, 17, 18, 19, 20, 22, 25, 28, 32], url: "http://road.cc/content/forum/149963-14-32-cs6800-cassette-gearing",
                                         clocking: " *   *   *   *   *   *   *---*   *---*---*" },
          { model: "(DIY) Deore XT",    sprockets: [14, 15, 16, 17, 19, 21, 24, 27, 31, 35, 40], url: "https://www.youtube.com/watch?v=gzDJyiy4tX0",
                                         clocking: " *   *   *   *   *   *---*---*   *---*---*" },
          { model: "(DIY) Deore XT",    sprockets: [14, 15, 16, 17, 19, 21, 24, 28, 32, 37, 42],
                                         clocking: " *   *   *   *   *   *---*---*   *---*---*" },
        ]
      },
      {
        brand: "SRAM",
        models: [
          { model: "PG-1130", sprockets: [11, 13, 15, 17, 19, 22, 25, 28, 32, 36, 42] },
          { model: "PG-1170", sprockets: [11, 12, 13, 14, 15, 16, 17, 19, 22, 25, 28] },
          { model: "PG-1170", sprockets: [11, 12, 13, 14, 15, 17, 19, 22, 25, 28, 32] },
          { model: "PG-1170", sprockets: [11, 12, 13, 15, 17, 19, 22, 25, 28, 32, 36], grams: 366 },
          { model: "XG-1150", sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42] },
        ]
      },
      {
        brand: "SunRace",
        models: [
          { model: "CSMX80 EA5", sprockets: [11, 13, 15, 18, 21, 24, 28, 32, 36, 42, 50], grams: 512 },
          { model: "CSRX1",      sprockets: [11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36], grams: 360 },
        ]
      },
    ]
  },
  {
    group: 12,
    infos: [
      {
        brand: "Shimano",
        models: [
          { model: "XTR CS-M9100-12", sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45] },
          { model: "XTR CS-M9100-12", sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51] },
        ]
      },
    ]
  },
];

//////////////////////////////////////////////////////////////////////////////

function formatChainringsGroup (key) {
  if (key == 1) {
    return "Single (1x)";
  } else if (key == 2) {
    return "Double (2x)";
  } else if (key == 3) {
    return "Triple (3x)";
  }
}

function formatClustersGroup (key) {
  return key + "-speed";
}

function formatCogInfoEntry (info, isChainring) {
  var range;
  if (isChainring) {
    range = info.sprockets[0] + "T";
    for (let i = 1; i < info.sprockets.length; ++i) {
      range = range + "/" + info.sprockets[i] + "T";
    }
  } else {
    if (info.sprockets.length == 1) {
      range = info.sprockets[0] + "T";
    } else {
      range = info.sprockets[0] + "-" + info.sprockets[info.sprockets.length - 1] + "T";
    }
  }

  var desc = "";
  if (info.model) {
    desc += info.model + " ";
  }
  desc += range;

  return desc;
}

function formatCogInfo (infos, formatGroup, formatEntry) {
  return infos.map(
    (x) => [
      formatGroup(x.group),
      x.infos.map((y) => [
        y.brand,
        y.models.map(formatEntry)
      ])
    ]);
}

var CHAINRINGS = formatCogInfo(CHAINRINGS_INFO, formatChainringsGroup, (x) => formatCogInfoEntry(x, true));
var CLUSTERS =  formatCogInfo(CLUSTERS_INFO, formatClustersGroup, (x) => formatCogInfoEntry(x, false));
