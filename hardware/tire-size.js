/*
 * http://www.cateye.com/data/resources/Tire_size_chart_ENG.pdf
 */

//////////////////////////////////////////////////////////////////////////////

var TIRE_SIZE_INFO = [
  { etrto: "47-203", nominal: "12x1.75",             circMm: 935 },
  { etrto: "54-203", nominal: "12x1.95",             circMm: 940,  aka: "12" },
  { etrto: "40-254", nominal: "14x1.50",             circMm: 1020, aka: "14" },
  { etrto: "47-254", nominal: "14x1.75",             circMm: 1055 },
  { etrto: "40-305", nominal: "16x1.50",             circMm: 1185 },
  { etrto: "47-305", nominal: "16x1.75",             circMm: 1195, aka: "16" },
  { etrto: "54-305", nominal: "16x2.00",             circMm: 1245 },
  { etrto: "28-349", nominal: "16x1-1/8",            circMm: 1290 },
  { etrto: "37-349", nominal: "16x1-3/8",            circMm: 1300 },
  { etrto: "32-369", nominal: "17x1-1/4 (369)",      circMm: 1340 },
  { etrto: "40-355", nominal: "18x1.50",             circMm: 1340 },
  { etrto: "47-355", nominal: "18x1.75",             circMm: 1350, aka: "18" },
  { etrto: "32-406", nominal: "20x1.25",             circMm: 1450 },
  { etrto: "35-406", nominal: "20x1.35",             circMm: 1460 },
  { etrto: "40-406", nominal: "20x1.50",             circMm: 1490 },
  { etrto: "47-406", nominal: "20x1.75",             circMm: 1515 },
  { etrto: "50-406", nominal: "20x1.95",             circMm: 1565 },
  { etrto: "28-451", nominal: "20x1-1/8",            circMm: 1545 },
  { etrto: "37-451", nominal: "20x1-3/8",            circMm: 1615, aka: "20" },
  { etrto: "37-501", nominal: "22x1-3/8",            circMm: 1770, aka: "22" },
  { etrto: "40-501", nominal: "22x1-1/2",            circMm: 1785 },
  { etrto: "47-507", nominal: "24x1.75",             circMm: 1890, aka: "24" },
  { etrto: "50-507", nominal: "24x2.00",             circMm: 1925 },
  { etrto: "54-507", nominal: "24x2.125",            circMm: 1965 },
  { etrto: "25-520", nominal: "24x1 (520)",          circMm: 1753 },
  {                  nominal: "24x3/4 Tubular",      circMm: 1785 },
  { etrto: "28-540", nominal: "24x1-1/8",            circMm: 1795 },
  { etrto: "32-540", nominal: "24x1-1/4",            circMm: 1905 },
  { etrto: "25-559", nominal: "26x1 (559)",          circMm: 1913 },
  { etrto: "32-559", nominal: "26x1.25",             circMm: 1950 },
  { etrto: "37-559", nominal: "26x1.40",             circMm: 2005 },
  { etrto: "40-559", nominal: "26x1.50",             circMm: 2010 },
  { etrto: "47-559", nominal: "26x1.75",             circMm: 2023 },
  { etrto: "50-559", nominal: "26x1.95",             circMm: 2050 },
  { etrto: "54-559", nominal: "26x2.10",             circMm: 2068 },
  { etrto: "57-559", nominal: "26x2.125",            circMm: 2070 },
  { etrto: "58-559", nominal: "26x2.35",             circMm: 2083 },
  { etrto: "75-559", nominal: "26x3.00",             circMm: 2170 },
  { etrto: "28-590", nominal: "26x1-1/8",            circMm: 1970 },
  { etrto: "37-590", nominal: "26x1-3/8",            circMm: 2068 },
  { etrto: "37-584", nominal: "26x1-1/2",            circMm: 2100, aka: "26" },
  {                  nominal: "650C Tubular 26x7/8", circMm: 1920 },
  { etrto: "20-571", nominal: "650x20C",             circMm: 1938 },
  { etrto: "23-571", nominal: "650x23C",             circMm: 1944 },
  { etrto: "25-571", nominal: "650x25C, 26x1 (571)", circMm: 1952 },
  { etrto: "40-590", nominal: "650x38A",             circMm: 2125 },
  { etrto: "28-584", nominal: "650x28B",             circMm: 2010 },
  { etrto: "40-584", nominal: "650x38B",             circMm: 2105 },
  { etrto: "47-584", nominal: "650x47B",             circMm: 2146 },
  { etrto: "25-630", nominal: "27x1 (630)",          circMm: 2145 },
  { etrto: "28-630", nominal: "27x1-1/8",            circMm: 2155, aka: "27" },
  { etrto: "32-630", nominal: "27x1-1/4",            circMm: 2161 },
  { etrto: "37-630", nominal: "27x1-3/8",            circMm: 2169 },
  { etrto: "40-584", nominal: "27.5x1.50",           circMm: 2079 },
  { etrto: "50-584", nominal: "27.5x1.95",           circMm: 2090 },
  { etrto: "54-584", nominal: "27.5x2.1",            circMm: 2148, aka: "27.5" },
  { etrto: "57-584", nominal: "27.5x2.25",           circMm: 2182 },
  { etrto: "18-622", nominal: "700x18C",             circMm: 2070 },
  { etrto: "19-622", nominal: "700x19C",             circMm: 2080 },
  { etrto: "20-622", nominal: "700x20C",             circMm: 2086 },
  { etrto: "23-622", nominal: "700x23C",             circMm: 2096 },
  { etrto: "25-622", nominal: "700x25C",             circMm: 2105 },
  { etrto: "28-622", nominal: "700x28C",             circMm: 2136 },
  { etrto: "30-622", nominal: "700x30C",             circMm: 2146 },
  { etrto: "32-622", nominal: "700x32C",             circMm: 2155 },
  {                  nominal: "700C Tubular",        circMm: 2130, aka: "700c" },
  { etrto: "35-622", nominal: "700x35C",             circMm: 2168 },
  { etrto: "38-622", nominal: "700x38C",             circMm: 2180 },
  { etrto: "40-622", nominal: "700x40C",             circMm: 2200 },
  { etrto: "42-622", nominal: "700x42C",             circMm: 2224 },
  { etrto: "44-622", nominal: "700x44C",             circMm: 2235 },
  { etrto: "45-622", nominal: "700x45C",             circMm: 2242 },
  { etrto: "47-622", nominal: "700x47C",             circMm: 2268 },
  { etrto: "54-622", nominal: "29x2.1",              circMm: 2288, aka: "29" },
  { etrto: "56-622", nominal: "29x2.2",              circMm: 2298 },
  { etrto: "60-622", nominal: "29x2.3",              circMm: 2326 },
];

//////////////////////////////////////////////////////////////////////////////

function __formatTireSize (entry) {
  var desc = entry.nominal;
  if (entry.etrto) {
    desc += "\t(ETRTO " + entry.etrto + ")";
  }
  return desc;
}

var TIRE_SIZES = TIRE_SIZE_INFO.map((x) => __formatTireSize(x));
