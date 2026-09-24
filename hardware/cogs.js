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
      { id: 0,  brand: "FSA",       model: "Gossamer Pro",        sprockets: [54] },
      { id: 1,  brand: "IRD",       model: "Polaris (1x)",        sprockets: [38] },
      { id: 2,  brand: "Race Face",                               sprockets: [24] },
      { id: 3,  brand: "Race Face",                               sprockets: [26] },
      { id: 4,  brand: "Race Face",                               sprockets: [28] },
      { id: 5,  brand: "Shimano",   model: "XTR M8000",           sprockets: [32] },
      { id: 6,  brand: "Shimano",   model: "XTR M8000",           sprockets: [34] },
      { id: 7,  brand: "Shimano",   model: "XTR M9100",           sprockets: [30] },
      { id: 8,  brand: "Shimano",   model: "XTR M9100",           sprockets: [32] },
      { id: 9,  brand: "Shimano",   model: "XTR M9100",           sprockets: [34] },
      { id: 10, brand: "Shimano",   model: "XTR M9100",           sprockets: [36] },
      { id: 11, brand: "Shimano",   model: "XTR M9100",           sprockets: [38] },
      { id: 12, brand: "SRAM",      model: "Force 1",             sprockets: [40] },
      { id: 13, brand: "SRAM",      model: "S350",                sprockets: [42] },
      { id: 14, brand: "Wolftooth", model: "96 BCD for Shimano",  sprockets: [32] },
      { id: 15, brand: "Wolftooth", model: "96 BCD for Shimano",  sprockets: [34] },
      { id: 16, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [36] },
      { id: 17, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [38] },
      { id: 18, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [40] },
      { id: 19, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [42] },
      { id: 20, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [44] },
      { id: 21, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [46] },
      { id: 22, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [48] },
      { id: 23, brand: "Wolftooth", model: "110 BCD for Shimano", sprockets: [50] },
      { id: 24, brand: "Woom",                                    sprockets: [25] },
      { id: 25, sprockets: [30] },
      { id: 26, sprockets: [32] },
      { id: 27, sprockets: [34] },
      { id: 28, sprockets: [36] },
      { id: 29, sprockets: [40] },
      { id: 30, sprockets: [50] },
      { id: 31, sprockets: [52] },
      { id: 32, sprockets: [54] },
      { id: 33, sprockets: [56] },
      { id: 34, sprockets: [58] },
      { id: 35, sprockets: [60] },
      { id: 36, sprockets: [62] },
    ]
  },
  {
    group: 2,
    infos: [
      { id: 0,  brand: "Absolute Black", model: "Oval",                 sprockets: [46, 30] },
      { id: 1,  brand: "Absolute Black", model: "Oval",                 sprockets: [48, 32] },
      { id: 2,  brand: "Campagnolo",     model: "Veloce",               sprockets: [50, 34] },
      { id: 3,  brand: "Easton",         model: "EC90SL",               sprockets: [46, 30] },
      { id: 4,  brand: "FSA",            model: "Comet",                sprockets: [36, 22] },
      { id: 5,  brand: "FSA",            model: "Powerbox",             sprockets: [46, 30] },
      { id: 6,  brand: "FSA",            model: "SL-K Modular",         sprockets: [46, 30], note: "Adventure" },
      { id: 7,  brand: "FSA",            model: "SL-K Modular",         sprockets: [48, 32], note: "Adventure" },
      { id: 8,  brand: "FSA",            model: "SL-K Modular",         sprockets: [50, 34] },
      { id: 9,  brand: "FSA",            model: "SL-K Modular",         sprockets: [52, 36] },
      { id: 10, brand: "IRD",            model: "Polaris (2x)",         sprockets: [42, 26] },
      { id: 11, brand: "Rotor",                                         sprockets: [46, 30] },
      { id: 12, brand: "Rotor",                                         sprockets: [48, 32] },
      { id: 13, brand: "Shimano (Road)", model: "Claris",               sprockets: [50, 34] },
      { id: 14, brand: "Shimano (Road)", model: "Tiagra",               sprockets: [50, 34] },
      { id: 15, brand: "Shimano (Road)", model: "105",                  sprockets: [50, 34] },
      { id: 16, brand: "Shimano (Road)", model: "Ultegra",              sprockets: [46, 36] },
      { id: 17, brand: "Shimano (Road)", model: "Ultegra",              sprockets: [50, 34] },
      { id: 18, brand: "Shimano (Road)", model: "Ultegra",              sprockets: [52, 36] },
      { id: 19, brand: "Shimano (Road)", model: "Ultegra",              sprockets: [53, 39] },
      { id: 20, brand: "Shimano (Road)", model: "Dura-Ace",             sprockets: [50, 34] },
      { id: 21, brand: "Shimano (Road)", model: "GRX-810",              sprockets: [48, 31] },
      { id: 22, brand: "Shimano (Road)", model: "(DIY) Ultegra",        sprockets: [46, 34] },
      { id: 23, brand: "Shimano (Road)", model: "(DIY) Ultegra",        sprockets: [50, 36] },
      { id: 24, brand: "Shimano (MTB)",  model: "SLX M7000",            sprockets: [34, 24] },
      { id: 25, brand: "Shimano (MTB)",  model: "SLX M7000",            sprockets: [36, 26] },
      { id: 26, brand: "Shimano (MTB)",  model: "SLX M7000",            sprockets: [38, 28] },
      { id: 27, brand: "Shimano (MTB)",  model: "Deore XT M8000",       sprockets: [34, 24] },
      { id: 28, brand: "Shimano (MTB)",  model: "Deore XT M8000",       sprockets: [36, 26] },
      { id: 29, brand: "Shimano (MTB)",  model: "Deore XT M8000",       sprockets: [38, 28] },
      { id: 30, brand: "Shimano (MTB)",  model: "(DIY) Deore XT M8000", sprockets: [34, 22] },
      { id: 31, brand: "Shimano (MTB)",  model: "(DIY) Deore XT M8000", sprockets: [34, 26] },
      { id: 32, sprockets: [50, 34] },
    ]
  },
  {
    group: 3,
    infos: [
      { id: 0, brand: "Shimano (Road)", model: "Claris",          sprockets: [50, 39, 30] },
      { id: 1, brand: "Shimano (Road)", model: "Tiagra",          sprockets: [50, 39, 30] },
      { id: 2, brand: "Shimano (MTB)",  model: "Deore LX (SG-X)", sprockets: [46, 36, 26] },
      { id: 3, brand: "Shimano (MTB)",  model: "Acera FC-M361",   sprockets: [42, 32, 22] },
      { id: 4, brand: "Shimano (MTB)",  model: "Deore XT M8000",  sprockets: [40, 30, 22] },
      { id: 5, brand: "Suntour",                                  sprockets: [48, 38, 28] },
      { id: 6, sprockets: [48, 38, 28] },
    ]
  },
];

//////////////////////////////////////////////////////////////////////////////

var CLUSTERS_INFO = [
  {
    group: 1,
    infos: [
      { id: 0, brand: "Woom", sprockets: [16] },
    ]
  },
  {
    group: 6,
    infos: [
      { id: 0, brand: "Epoch",                        sprockets: [14, 17, 19, 22, 24, 28], url: "https://www.santafixie.com/en/epoch-6-speed-14-28-freewheel.html" },
      { id: 1, brand: "Shimano", model: "MF-TZ500-6", sprockets: [14, 16, 18, 21, 24, 28] },
    ]
  },
  {
    group: 7,
    infos: [
      { id: 0,  brand: "Epoch",                                   sprockets: [11, 13, 15, 18, 21, 24, 28] },
      { id: 1,  brand: "Epoch",                                   sprockets: [14, 16, 18, 20, 22, 24, 32] },
      { id: 2,  brand: "MicroShift", model: "H07",                sprockets: [12, 15, 18, 22, 28, 34, 40] },
      { id: 3,  brand: "Shimano",    model: "CS-HG90",            sprockets: [12, 14, 16, 18, 21, 24, 28] },
      { id: 4,  brand: "Shimano",    model: "CS-HG200-7 (11-28)", sprockets: [12, 14, 16, 18, 21, 24, 28] },
      { id: 5,  brand: "Shimano",    model: "CS-HG200-7 (11-32)", sprockets: [12, 14, 16, 18, 21, 26, 32] },
      { id: 6,  brand: "Shimano",    model: "MF-HG37",            sprockets: [13, 15, 17, 19, 21, 24, 28] },
      { id: 7,  brand: "Shimano",    model: "MF-TZ2",             sprockets: [14, 15, 17, 19, 21, 24, 28] },
      { id: 8,  brand: "Shimano",    model: "MF-TZ500-7",         sprockets: [14, 16, 18, 20, 22, 24, 34] },
      { id: 9,  brand: "SunRace",                                 sprockets: [13, 15, 17, 19, 21, 24, 28] },
      { id: 10, brand: "S-Ride",     model: "CS-E500",            sprockets: [13, 16, 20, 24, 30, 36, 42] },
    ]
  },
  {
    group: 8,
    infos: [
      { id: 0,  brand: "Shimano", model: "Sora CS-HG50",          sprockets: [11, 13, 15, 18, 21, 24, 28, 34] },
      { id: 1,  brand: "Shimano", model: "Sora CS-HG50-8 (an)",   sprockets: [11, 13, 15, 17, 20, 23, 26, 30] },
      { id: 2,  brand: "Shimano", model: "Sora CS-HG50-8 (aw)",   sprockets: [11, 13, 15, 18, 21, 24, 28, 32] },
      { id: 3,  brand: "Shimano", model: "Sora CS-HG50-8 (bf)",   sprockets: [11, 13, 15, 17, 19, 21, 24, 28], url: "http://si.shimano.com/pdfs/ev/EV-CS-HG50-8-3072B.pdf" },
      { id: 4,  brand: "Shimano", model: "Sora CS-HG50-8 (S)",    sprockets: [12, 13, 14, 15, 16, 17, 19, 21] },
      { id: 5,  brand: "Shimano", model: "Sora CS-HG50-8 (T)",    sprockets: [13, 14, 15, 16, 17, 19, 21, 23], grams: 300 },
      { id: 6,  brand: "Shimano", model: "Sora CS-HG50-8 (U)",    sprockets: [12, 13, 14, 15, 17, 19, 21, 23] },
      { id: 7,  brand: "Shimano", model: "Sora CS-HG50-8 (V)",    sprockets: [13, 14, 15, 17, 19, 21, 23, 26] },
      { id: 8,  brand: "Shimano", model: "Sora CS-HG50-8 (W)",    sprockets: [12, 13, 15, 17, 19, 21, 23, 25] },
      { id: 9,  brand: "Shimano", model: "Tourney TX CS-HG200-8", sprockets: [12, 14, 16, 18, 21, 24, 28, 32], url: "https://bike.shimano.com/en-UK/products/components/pdp.P-CS-HG200-8.html" },
      { id: 10, brand: "Shimano", model: "Altus CS-HG31",         sprockets: [11, 13, 15, 18, 21, 24, 28, 32] },
      { id: 11, brand: "Shimano", model: "Altus HG31",            sprockets: [11, 13, 15, 17, 20, 23, 26, 34] },
      { id: 12, brand: "Shimano", model: "XTR",                   sprockets: [11, 12, 14, 16, 18, 21, 24, 28] },
      { id: 13, brand: "Shimano", model: "XTR",                   sprockets: [12, 13, 14, 16, 18, 21, 24, 28] },
      { id: 14, brand: "SunRace", model: "CSM66",                 sprockets: [12, 14, 16, 18, 21, 24, 28, 34] },
      { id: 15, brand: "SunRace", model: "CSM680 8AX",            sprockets: [11, 13, 15, 18, 22, 28, 34, 40] },
      { id: 16, brand: "SunRace", model: "Freewheel",             sprockets: [13, 15, 17, 19, 22, 25, 28, 34] },
    ]
  },
  {
    group: 9,
    infos: [
      { id: 0, brand: "Shimano", model: "Sora", sprockets: [11, 12, 14, 16, 18, 21, 24, 28, 32] },
    ]
  },
  {
    group: 10,
    infos: [
      { id: 0, brand: "Campagnolo", model: "Veloce",  sprockets: [13, 14, 15, 16, 17, 19, 21, 23, 26, 29], url: "https://www.campagnolo.com/media/files/035_221_Technical%20manual%20-%20sprocket%20pack%20-%20Campagnolo_REV00__09_14.pdf" },
      { id: 1, brand: "Shimano",    model: "Tiagra",  sprockets: [11, 12, 14, 16, 18, 20, 22, 25, 28, 32] },
      { id: 2, brand: "Shimano",    model: "Tiagra",  sprockets: [11, 13, 15, 17, 19, 21, 23, 26, 30, 34] },
      { id: 3, brand: "Shimano",    model: "Tiagra",  sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 28] },
      { id: 4, brand: "Shimano",    model: "Tiagra",  sprockets: [12, 13, 14, 15, 17, 19, 21, 24, 27, 30] },
      { id: 5, brand: "Shimano",    model: "Ultegra", sprockets: [13, 14, 15, 16, 17, 18, 19, 21, 23, 25] },
      { id: 6, brand: "Shimano",    model: "Ultegra", sprockets: [14, 15, 16, 17, 18, 19, 20, 21, 23, 25] },
      { id: 7, brand: "Shimano",    model: "Ultegra", sprockets: [16, 17, 18, 19, 20, 21, 22, 23, 25, 27] },
    ]
  },
  {
    group: 11,
    infos: [
      { id: 0,  brand: "IRD",                                         sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 27, 30], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
      { id: 1,  brand: "IRD",                                         sprockets: [12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
      { id: 2,  brand: "IRD",                                         sprockets: [12, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34], url: "http://www.interlocracing.com/cassettes-freewheels/11-speed-elite-cassette-shimano-compatible" },
      { id: 3,  brand: "JFOYH Ultralight",                            sprockets: [11, 13, 15, 17, 19, 21, 23, 25, 28, 31, 34], grams: 239 },
      { id: 4,  brand: "JFOYH Ultralight",                            sprockets: [11, 13, 15, 17, 19, 21, 23, 25, 28, 32, 36], grams: 239 },
      { id: 5,  brand: "Meroca/Sunshine", model: "Ultra-Light",       sprockets: [11, 13, 15, 17, 19, 21, 24, 28, 32, 36, 42], grams: 385 },
      { id: 6,  brand: "Meroca/Sunshine", model: "Ultra-Light",       sprockets: [11, 13, 15, 18, 21, 24, 28, 32, 36, 40, 46], grams: 432 },
      { id: 7,  brand: "Meroca/Sunshine", model: "Ultra-Light",       sprockets: [11, 13, 15, 18, 21, 24, 28, 32, 36, 42, 50], grams: 447 },
      { id: 8,  brand: "Relic MTB",                                   sprockets: [11, 12, 13, 14, 16, 19, 21, 23, 25, 28, 40], url: "http://www.relicmtb.com/PRODUCTS/r40t-sprocket/",
                                                                       clocking: " *   *   *   *   +   *---*   *---*---*   +" },
      { id: 9,  brand: "Shimano",         model: "105 CS-R7000",      sprockets: [11, 12, 13, 14, 16, 18, 20, 22, 25, 28, 32], grams: 320 },
      { id: 10, brand: "Shimano",         model: "Ultegra CS-6800",   sprockets: [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23] },
      { id: 11, brand: "Shimano",         model: "Ultegra CS-HG800",  sprockets: [11, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34], grams: 335, url: "http://www.cyclingforum.com/phpBB2/viewtopic.php?t=12012",
                                                                       clocking: " B   C   C   E   H   J---D---D   E---B---A" },
      { id: 12, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25],
                                                                       clocking: " *   *   *   *   *   *   *---*   *---*---*" },
      { id: 13, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28], grams: 249,
                                                                       clocking: " A   A   A   A   A   B   C---C   C---B---A" },
      { id: 14, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], grams: 271 },
      { id: 15, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [11, 12, 13, 14, 16, 18, 20, 22, 25, 28, 32], grams: 281,
                                                                       clocking: " A   A   A   A   B   C   A---A   C---B---A" },
      { id: 16, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 25],
                                                                       clocking: " A   A   A   A   A   C   B---D   B---B---A" },
      { id: 17, brand: "Shimano",         model: "Ultegra CS-R8000",  sprockets: [14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 28],
                                                                       clocking: " B   B   A   C   D   F   C---E   C---B---A" },
      { id: 18, brand: "Shimano",         model: "Dura-Ace CS-R9100", sprockets: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], grams: 209,
                                                                       clocking: " A   A   A   A   A   B   C---C---A   A---A" },
      { id: 19, brand: "Shimano",         model: "Dura-Ace CS-R9100", sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28],
                                                                       clocking: " B   B   A   A   A   C   C---C---C   B---A" },
      { id: 20, brand: "Shimano",         model: "Deore CS-M5100",    sprockets: [11, 13, 15, 18, 21, 24, 28, 33, 39, 45, 51], grams: 627 },
      { id: 21, brand: "Shimano",         model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 27, 31, 35, 40], grams: 411,
                                                                       clocking: " *   *   *   *   *   *---*---*   *---*---*" },
      { id: 22, brand: "Shimano",         model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 28, 32, 37, 42], grams: 434,
                                                                       clocking: " *   *   *   *   *   *---*---*   *---*---*" },
      { id: 23, brand: "Shimano",         model: "Deore XT CS-M8000", sprockets: [11, 13, 15, 17, 19, 21, 24, 28, 32, 37, 46] },
      { id: 24, brand: "Shimano",         model: "XTR CS-M9001",      sprockets: [11, 13, 15, 17, 19, 21, 24, 27, 31, 35, 40], grams: 330 },
      { id: 25, brand: "Shimano",         model: "(DIY) Ultegra",     sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28], note: "DIY version of 12-28T (11psd) Shimano Dura-Ace CS-R9100",
                                                                       clocking: " *   *   *   *   *   *   *---*   *---*---*" },
      { id: 26, brand: "Shimano",         model: "(DIY) Ultegra",     sprockets: [12, 13, 14, 15, 16, 17, 19, 21, 24, 27, 30],
                                                                       clocking: " *   *   *   *   *   *   *---*   *---*---*" },
      { id: 27, brand: "Shimano",         model: "(DIY) Ultegra",     sprockets: [14, 15, 16, 17, 18, 19, 20, 22, 25, 28, 32], url: "http://road.cc/content/forum/149963-14-32-cs6800-cassette-gearing",
                                                                       clocking: " *   *   *   *   *   *   *---*   *---*---*" },
      { id: 28, brand: "Shimano",         model: "(DIY) Deore XT",    sprockets: [14, 15, 16, 17, 19, 21, 24, 27, 31, 35, 40], url: "https://www.youtube.com/watch?v=gzDJyiy4tX0",
                                                                       clocking: " *   *   *   *   *   *---*---*   *---*---*" },
      { id: 29, brand: "Shimano",         model: "(DIY) Deore XT",    sprockets: [14, 15, 16, 17, 19, 21, 24, 28, 32, 37, 42],
                                                                       clocking: " *   *   *   *   *   *---*---*   *---*---*" },
      { id: 30, brand: "SRAM",            model: "PG-1130",           sprockets: [11, 13, 15, 17, 19, 22, 25, 28, 32, 36, 42] },
      { id: 31, brand: "SRAM",            model: "PG-1170",           sprockets: [11, 12, 13, 14, 15, 16, 17, 19, 22, 25, 28] },
      { id: 32, brand: "SRAM",            model: "PG-1170",           sprockets: [11, 12, 13, 14, 15, 17, 19, 22, 25, 28, 32] },
      { id: 33, brand: "SRAM",            model: "PG-1170",           sprockets: [11, 12, 13, 15, 17, 19, 22, 25, 28, 32, 36], grams: 366 },
      { id: 34, brand: "SRAM",            model: "XG-1150",           sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42] },
      { id: 35, brand: "SunRace",         model: "CSMX80 EA5",        sprockets: [11, 13, 15, 18, 21, 24, 28, 32, 36, 42, 50], grams: 512 },
      { id: 36, brand: "SunRace",         model: "CSRX1",             sprockets: [11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36], grams: 360 },
    ]
  },
  {
    group: 12,
    infos: [
      { id: 0, brand: "Shimano", model: "XTR CS-M9100-12", sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45] },
      { id: 1, brand: "Shimano", model: "XTR CS-M9100-12", sprockets: [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51] },
    ]
  },
  {
    group: 13,
    infos: []
  },
];

//////////////////////////////////////////////////////////////////////////////

if (typeof PETER_HEINLE_INFO !== "undefined") {
  // Ids start well past any static entry's id, so they never drift if the
  // static list above grows.
  let nextId = new Map();
  for (let src of PETER_HEINLE_INFO) {
    for (let dst of CLUSTERS_INFO) {
      if (src.group != dst.group) {
        continue;
      }
      if (!nextId.has(dst)) {
        nextId.set(dst, 1000);
      }
      for (let srcInfo of src.infos) {
        srcInfo.id = nextId.get(dst);
        nextId.set(dst, nextId.get(dst) + 1);
        dst.infos.push(srcInfo);
      }
    }
  }
}

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

function formatCogInfoBrand (brand) {
  return brand || "Unbranded";
}

function formatCogInfoSize (info, isChainring) {
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
  return range;
}

function formatCogInfoEntry (info, isChainring) {
  var desc = formatCogInfoBrand(info.brand) + " ";
  if (info.model) {
    desc += info.model + " ";
  }
  desc += formatCogInfoSize(info, isChainring);
  return desc;
}
