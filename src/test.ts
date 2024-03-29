import { getFrcsOutputs } from './index';
import {
  testBiomassSalvage,
  testCableCTL,
  testCableManualLog,
  testCableManualWt,
  testCableManualWtLog,
  testExcludeCollectChipResiduesCosts,
  testExcludeLoadingCosts,
  testGroundCtl,
  testGroundManualLog,
  testGroundManualWt,
  testGroundMechWt,
  testHelicopterCtl,
  testHelicopterManualLog,
  testMoveIn,
  testPartialCut,
} from './test.data';

test('testGroundMechWt', () => {
  const res = getFrcsOutputs(testGroundMechWt);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(627.3814992);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(63.00680825);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(16.56235006);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(7))).toBe(12.6485629);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.270272678);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(153.2614717);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(15.39177705);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(4.045975452);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(4.409948082);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.442883243);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testGroundManualWt', () => {
  const res = getFrcsOutputs(testGroundManualWt);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(784.1231539);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(78.74809388);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(20.70019945);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(13.94991762);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.400965419);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(180.9851904);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(18.17602081);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(4.777858581);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(4.353405622);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.437204785);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.139921192);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.014052036);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testGroundManualLog', () => {
  const res = getFrcsOutputs(testGroundManualLog);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(32.77962505);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1019.241489);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(102.3606101);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(31.09375068);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(12.28383479);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.233643682);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(213.8010788);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(21.47166213);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(6.522377192);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(3.461065049);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.347588608);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.152576795);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.015323016);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testGroundCtl', () => {
  const res = getFrcsOutputs(testGroundCtl);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(25.25720838);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(974.7210172);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(156.1727899);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(38.59179536);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(13.55470498);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(8))).toBe(2.17177639);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(9.644013902);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(405.6137859);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(7))).toBe(64.9886844);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(8))).toBe(16.05932769);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(6.611564304);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(1.059325104);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testCableManualWtLog', () => {
  const res = getFrcsOutputs(testCableManualWtLog);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(34.17209172);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1696.656652);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(170.3922103);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(7))).toBe(49.6503599);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(23.37905983);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(2.347917402);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(7.848758345);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(394.1303758);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(39.58181273);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(8))).toBe(11.53369185);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(5.611967166);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.563599882);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(8))).toBe(0.12388653);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.012441704);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testCableManualWt', () => {
  const res = getFrcsOutputs(testCableManualWt);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1700.800665);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(170.8083861);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(44.89972375);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(25.04514267);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(2.515239139);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(359.9823599);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(36.15238822);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(9.503235062);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(6.519940586);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.654786038);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.139921192);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.014052036);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testCableManualLog', () => {
  const res = getFrcsOutputs(testCableManualLog);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(32.77962505);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(3))).toBe(1935.919);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(194.4209024);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(59.05860719);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(23.37905983);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(2.347917402);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(394.3503492);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(39.60390427);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(7))).toBe(12.0303496);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(5.646386237);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.567056528);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.152576795);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.015323016);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testCableCTL', () => {
  const res = getFrcsOutputs(testCableCTL);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(22.06948616);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1475.913722);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(236.4754217);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(66.87576283);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(22.36644989);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(3.583621178);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(6))).toBe(431.883024);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(69.19762227);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(8))).toBe(19.56923786);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(7.259539152);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(1.163145621);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testHelicopterManualLog', () => {
  const res = getFrcsOutputs(testHelicopterManualLog);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(32.77962505);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1498.125798);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(150.4541097);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(45.70295713);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(9))).toBe(4.459452581);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(0.447854892);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(8))).toBe(43.56749545);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(9))).toBe(4.375406089);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(307.1884303);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(30.85038776);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(9.371322272);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(1.642562703);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.164959651);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.152576795);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.015323016);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(9))).toBe(8.581076139);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(9))).toBe(0.861782216);
});

test('testHelicopterCtl', () => {
  const res = getFrcsOutputs(testHelicopterCtl);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(22.06948616);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(1301.274018);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(208.4941128);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(58.96258792);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(9))).toBe(8.937338816);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.431967827);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(8))).toBe(39.91362045);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(9))).toBe(6.395082643);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(385.9430324);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(61.83697596);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(7))).toBe(17.4876311);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(1.642562703);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.263176432);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(7))).toBe(11.6764828);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(9))).toBe(1.870841875);
});

test('testMoveIn', () => {
  const res = getFrcsOutputs(testMoveIn);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(734.8941541);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(73.80411299);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(19.40059478);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(7))).toBe(15.2506596);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.531596622);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(153.2614717);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(15.39177705);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(4.045975452);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(4.409948082);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.442883243);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testPartialCut', () => {
  const res = getFrcsOutputs(testPartialCut);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(696.5580064);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(69.95408184);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(18.38855235);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(14.30636276);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(8))).toBe(1.43676257);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(166.9937862);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(16.77088897);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(4.408497141);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(4.733662234);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.47539328);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testBiomassSalvage', () => {
  const res = getFrcsOutputs(testBiomassSalvage);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(665.9811065);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(66.88329817);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(17.58134761);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(19.11031502);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.919214952);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(665.9811065);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(66.88329817);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(8))).toBe(17.58134761);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(8))).toBe(19.11031502);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(1.919214952);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testExcludeLoadingCosts', () => {
  const res = getFrcsOutputs(testExcludeLoadingCosts);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(7))).toBe(547.7240581);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(7))).toBe(55.0069531);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(14.45945983);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(11.24011796);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.128825058);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(153.2614717);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(15.39177705);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(4.045975452);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(4.409948082);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.442883243);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testExcludeCollectChipResiduesCosts', () => {
  const res = getFrcsOutputs(testExcludeCollectChipResiduesCosts);

  expect(parseFloat(res.totalBiomass.yieldPerAcre.toFixed(8))).toBe(34.17209172);
  expect(parseFloat(res.totalBiomass.costPerAcre.toFixed(6))).toBe(598.718372);
  expect(parseFloat(res.totalBiomass.costPerBoleCCF.toFixed(8))).toBe(60.12822136);
  expect(parseFloat(res.totalBiomass.costPerGT.toFixed(8))).toBe(17.52068258);
  expect(parseFloat(res.totalBiomass.dieselPerAcre.toFixed(8))).toBe(11.74058948);
  expect(parseFloat(res.totalBiomass.dieselPerBoleCCF.toFixed(9))).toBe(1.179086523);
  expect(parseFloat(res.totalBiomass.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.totalBiomass.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.totalBiomass.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.totalBiomass.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.feedstock.yieldPerAcre.toFixed(9))).toBe(7.848758345);
  expect(parseFloat(res.feedstock.costPerAcre.toFixed(7))).toBe(124.5983445);
  expect(parseFloat(res.feedstock.costPerBoleCCF.toFixed(8))).toBe(12.51319015);
  expect(parseFloat(res.feedstock.costPerGT.toFixed(9))).toBe(3.646201862);
  expect(parseFloat(res.feedstock.dieselPerAcre.toFixed(9))).toBe(3.501974662);
  expect(parseFloat(res.feedstock.dieselPerBoleCCF.toFixed(9))).toBe(0.351697088);
  expect(parseFloat(res.feedstock.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.feedstock.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});
