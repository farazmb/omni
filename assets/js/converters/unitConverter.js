/**
 * OmniConvert - Unit & Measurement Converter Engine
 * Supports: Currency (Live rates), Length/Weight/Temperature, Timezone, Data Storage
 */
const UnitConverter = {
  // Static fallback exchange rates (USD base)
  fallbackRates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    PKR: 278.50,
    INR: 83.50,
    AED: 3.67,
    SAR: 3.75,
    CAD: 1.36,
    AUD: 1.52,
    JPY: 155.20,
    CNY: 7.24,
    TRY: 32.80,
    BRL: 5.40,
    SGD: 1.35
  },
  cachedRates: null,

  async fetchCurrencyRates() {
    if (this.cachedRates) return this.cachedRates;
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data && data.rates) {
        this.cachedRates = data.rates;
        return data.rates;
      }
    } catch (e) {
      console.warn('Using fallback currency rates due to network limit.');
    }
    this.cachedRates = this.fallbackRates;
    return this.fallbackRates;
  },

  async convertCurrency(amount, fromCurr, toCurr) {
    const rates = await this.fetchCurrencyRates();
    const fromRate = rates[fromCurr] || 1;
    const toRate = rates[toCurr] || 1;
    const inUSD = amount / fromRate;
    return (inUSD * toRate).toFixed(4);
  },

  /**
   * Length Conversion (Base in meters)
   */
  lengthUnits: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
    nm: 1852 // nautical mile
  },

  convertLength(value, fromUnit, toUnit) {
    const meters = value * this.lengthUnits[fromUnit];
    return meters / this.lengthUnits[toUnit];
  },

  /**
   * Weight Conversion (Base in kilograms)
   */
  weightUnits: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523,
    t: 1000 // metric ton
  },

  convertWeight(value, fromUnit, toUnit) {
    const kg = value * this.weightUnits[fromUnit];
    return kg / this.weightUnits[toUnit];
  },

  /**
   * Temperature Conversion
   */
  convertTemperature(value, fromUnit, toUnit) {
    let c = value;
    if (fromUnit === 'f') c = (value - 32) * (5 / 9);
    else if (fromUnit === 'k') c = value - 273.15;

    if (toUnit === 'c') return c;
    if (toUnit === 'f') return (c * (9 / 5)) + 32;
    if (toUnit === 'k') return c + 273.15;
    return c;
  },

  /**
   * Data Storage Conversion (Base in Bytes)
   */
  dataUnits: {
    b: 1 / 8,
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5
  },

  convertData(value, fromUnit, toUnit) {
    const bytes = value * this.dataUnits[fromUnit];
    return bytes / this.dataUnits[toUnit];
  },

  /**
   * Timezone Converter
   */
  convertTimezone(dateStr, timeStr, fromTz, toTz) {
    try {
      const dt = new Date(`${dateStr}T${timeStr}:00`);
      const fromDateString = dt.toLocaleString('en-US', { timeZone: fromTz });
      const convertedDate = new Date(fromDateString);
      
      const targetString = dt.toLocaleString('en-US', {
        timeZone: toTz,
        dateStyle: 'full',
        timeStyle: 'medium'
      });
      return targetString;
    } catch (e) {
      return 'Invalid Time/Timezone';
    }
  }
};

window.UnitConverter = UnitConverter;
