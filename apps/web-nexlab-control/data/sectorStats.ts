import { FaLeaf, FaThermometerHalf, FaTint, FaBolt, FaFlask } from 'react-icons/fa';

export const STAT_GROUPS = {
  npk: [
    { name: 'Nitrógeno (N)', key: 'n', unit: 'mg/kg', icon: FaLeaf },
    { name: 'Fósforo (P)', key: 'p', unit: 'mg/kg', icon: FaLeaf },
    { name: 'Potasio (K)', key: 'k', unit: 'mg/kg', icon: FaLeaf },
  ],
  suelo: [
    { name: 'Temperatura', key: 'temperature', unit: '°C', icon: FaThermometerHalf },
    { name: 'Humedad', key: 'humidity', unit: '%', icon: FaTint },
    { name: 'Conductividad (EC)', key: 'ec', unit: 'mS/cm', icon: FaBolt },
    { name: 'pH', key: 'ph', unit: '', icon: FaFlask },
  ],
  saman: [
    { name: 'Humedad Ambiente', key: 'humedadAmbiente', unit: '%', icon: FaTint },
    { name: 'Temperatura Ambiente', key: 'temperaturaAmbiente', unit: '°C', icon: FaThermometerHalf },
    { name: 'Temp Entrada Arroz', key: 'tempEntradaArroz', unit: '°C', icon: FaThermometerHalf },
    { name: 'Temp Salida Arroz', key: 'tempSalidaArroz', unit: '°C', icon: FaThermometerHalf },
  ],
};

export const SECTOR_STATS = [
  {
    name: 'MDP',
    stats: {
      npk: {
        values: { n: 40, p: 15, k: 30 },
        historical: {
          n: [28, 30, 34, 33, 40],
          p: [11, 10.5, 13, 12.7, 15.2],
          k: [19, 21.5, 26, 28.2, 30.5],
        },
      },
      suelo: {
        values: {
          temperature: 22.5,
          humidity: 70,
          ec: 1.2,
          ph: 6.8,
        },
        historical: {
          temperature: [20.5, 21.3, 22.1, 22.7, 23.2],
          humidity: [58, 63, 65, 68, 70],
          ec: [0.9, 1.0, 1.05, 1.18, 1.3],
          ph: [6.4, 6.5, 6.6, 6.75, 6.85],
        },
      },
    },
  },
  {
    name: 'LATITUD',
    stats: {
      saman: {
        values: {
          humedadAmbiente: 45,
          temperaturaAmbiente: 21.5,
          tempEntradaArroz: 35.2,
          tempSalidaArroz: 32.8,
        },
        historical: {
          humedadAmbiente: [40, 42, 43, 45, 45],
          temperaturaAmbiente: [20.5, 21, 21.2, 21.4, 21.5],
          tempEntradaArroz: [33, 34.2, 35, 35.1, 35.2],
          tempSalidaArroz: [31.5, 32, 32.3, 32.5, 32.8],
        },
      },
    },
  },
  { name: 'ANTÁRTIDA', stats: {} },
  { name: 'XXX', stats: {} },
];
