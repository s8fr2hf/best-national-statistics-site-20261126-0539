// StatAtlas data: published national statistics, rounded to sensible precision.
// Every figure below comes from a reputable public source named in its indicator
// record (World Bank Open Data, World Development Indicators 2023; ILO modelled
// estimates; Global Carbon Budget 2022 via Our World in Data). Nothing here is
// invented: values are the published figures, rounded as noted per indicator.

export const INDICATORS = [
  {
    id: 'population',
    name: 'Population',
    short: 'Population',
    unit: 'million people',
    decimals: 0,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'Total population, mid-year estimate, rounded to the nearest million.',
    higherIs: 'bigger',
    format: (v) => v.toLocaleString('en-US'),
  },
  {
    id: 'gdp',
    name: 'Gross domestic product',
    short: 'GDP',
    unit: 'US$ billion',
    decimals: 0,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'GDP at current market prices, rounded to the nearest billion US dollars.',
    higherIs: 'bigger',
    format: (v) => v.toLocaleString('en-US'),
  },
  {
    id: 'gdppc',
    name: 'GDP per capita',
    short: 'GDP per capita',
    unit: 'US$',
    decimals: 0,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'GDP divided by mid-year population, current US dollars.',
    higherIs: 'bigger',
    format: (v) => v.toLocaleString('en-US'),
  },
  {
    id: 'life',
    name: 'Life expectancy at birth',
    short: 'Life expectancy',
    unit: 'years',
    decimals: 1,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'Years a newborn would live if mortality patterns stayed as they are.',
    higherIs: 'bigger',
    format: (v) => v.toFixed(1),
  },
  {
    id: 'unemp',
    name: 'Unemployment rate',
    short: 'Unemployment',
    unit: '% of labour force',
    decimals: 1,
    source: 'ILO modelled estimates (World Bank)',
    year: 2023,
    note: 'Share of the labour force without work but available and seeking work.',
    higherIs: 'smaller',
    format: (v) => v.toFixed(1),
  },
  {
    id: 'infl',
    name: 'Inflation, consumer prices',
    short: 'Inflation',
    unit: 'annual %',
    decimals: 1,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'Annual change in the consumer price index.',
    higherIs: 'smaller',
    format: (v) => v.toFixed(1),
  },
  {
    id: 'co2',
    name: 'CO2 emissions per capita',
    short: 'CO2 per capita',
    unit: 'tonnes per person',
    decimals: 1,
    source: 'Global Carbon Budget (Our World in Data)',
    year: 2022,
    note: 'Carbon dioxide from fossil fuels and industry, per person.',
    higherIs: 'smaller',
    format: (v) => v.toFixed(1),
  },
  {
    id: 'internet',
    name: 'People using the Internet',
    short: 'Internet users',
    unit: '% of population',
    decimals: 0,
    source: 'World Bank, World Development Indicators',
    year: 2023,
    note: 'Share of the population that used the Internet in the last three months.',
    higherIs: 'bigger',
    format: (v) => v.toFixed(0),
  },
];

// One row per country. Values follow the indicator order above:
// [population, gdp, gdppc, life, unemp, infl, co2, internet]
export const COUNTRIES = [
  { id: 'usa', name: 'United States', capital: 'Washington, D.C.', region: 'North America', values: [335, 27361, 81695, 78.4, 3.6, 4.1, 14.0, 92] },
  { id: 'chn', name: 'China', capital: 'Beijing', region: 'East Asia', values: [1412, 17795, 12597, 78.6, 4.6, 0.2, 8.0, 77] },
  { id: 'ind', name: 'India', capital: 'New Delhi', region: 'South Asia', values: [1429, 3568, 2485, 67.7, 4.2, 5.4, 1.9, 55] },
  { id: 'jpn', name: 'Japan', capital: 'Tokyo', region: 'East Asia', values: [125, 4213, 33899, 84.0, 2.6, 3.3, 8.7, 93] },
  { id: 'deu', name: 'Germany', capital: 'Berlin', region: 'Europe', values: [85, 4456, 52637, 81.7, 3.0, 5.9, 7.9, 93] },
  { id: 'gbr', name: 'United Kingdom', capital: 'London', region: 'Europe', values: [68, 3341, 48914, 81.8, 4.0, 7.3, 5.0, 97] },
  { id: 'fra', name: 'France', capital: 'Paris', region: 'Europe', values: [68, 3030, 44461, 83.3, 7.3, 4.9, 4.7, 94] },
  { id: 'bra', name: 'Brazil', capital: 'Brasilia', region: 'South America', values: [216, 2174, 10044, 76.4, 8.0, 4.6, 2.2, 84] },
  { id: 'mex', name: 'Mexico', capital: 'Mexico City', region: 'North America', values: [130, 1789, 13799, 75.4, 2.8, 5.5, 3.6, 81] },
  { id: 'idn', name: 'Indonesia', capital: 'Jakarta', region: 'Southeast Asia', values: [278, 1371, 4946, 71.1, 3.5, 3.7, 2.6, 66] },
  { id: 'nga', name: 'Nigeria', capital: 'Abuja', region: 'Africa', values: [224, 363, 1621, 52.7, 5.4, 24.7, 0.6, 36] },
  { id: 'egy', name: 'Egypt', capital: 'Cairo', region: 'Africa', values: [113, 396, 3514, 70.7, 7.2, 33.9, 2.2, 72] },
  { id: 'vnm', name: 'Vietnam', capital: 'Hanoi', region: 'Southeast Asia', values: [99, 430, 4348, 74.6, 2.1, 3.3, 3.0, 79] },
  { id: 'phl', name: 'Philippines', capital: 'Manila', region: 'Southeast Asia', values: [117, 437, 3725, 72.4, 4.4, 6.0, 1.3, 83] },
  { id: 'bgd', name: 'Bangladesh', capital: 'Dhaka', region: 'South Asia', values: [173, 437, 2529, 73.1, 4.5, 9.9, 0.6, 39] },
  { id: 'eth', name: 'Ethiopia', capital: 'Addis Ababa', region: 'Africa', values: [127, 164, 1293, 65.0, 3.3, 30.2, 0.1, 19] },
  { id: 'rus', name: 'Russia', capital: 'Moscow', region: 'Europe', values: [144, 2021, 13952, 72.4, 3.2, 5.9, 11.4, 92] },
  { id: 'pak', name: 'Pakistan', capital: 'Islamabad', region: 'South Asia', values: [241, 338, 1407, 66.1, 5.5, 29.2, 0.8, 36] },
];

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id) || null;
}

export function countryById(id) {
  return COUNTRIES.find((c) => c.id === id) || null;
}

export function valueOf(country, indicator) {
  const idx = INDICATORS.indexOf(indicator);
  return country.values[idx];
}

// Rank of a country on an indicator: 1 is best (highest when higherIs is
// 'bigger', lowest when it is 'smaller').
export function rankOf(country, indicator) {
  const idx = INDICATORS.indexOf(indicator);
  const sorted = [...COUNTRIES].sort((a, b) => {
    const d = a.values[idx] - b.values[idx];
    return indicator.higherIs === 'bigger' ? -d : d;
  });
  return sorted.findIndex((c) => c.id === country.id) + 1;
}

export function averageOf(indicator) {
  const idx = INDICATORS.indexOf(indicator);
  const sum = COUNTRIES.reduce((s, c) => s + c.values[idx], 0);
  return sum / COUNTRIES.length;
}

export function topCountries(indicator, n) {
  const idx = INDICATORS.indexOf(indicator);
  const sorted = [...COUNTRIES].sort((a, b) => {
    const d = a.values[idx] - b.values[idx];
    return indicator.higherIs === 'bigger' ? -d : d;
  });
  return sorted.slice(0, n);
}
