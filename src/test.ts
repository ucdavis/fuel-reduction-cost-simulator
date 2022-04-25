import { getFrcsOutputs } from './index';
import { testCableManualWtLog, testGroundManualLog, testGroundManualWt, testGroundMechWt } from './test.data';

test('testGroundMechWt', () => {
  const res = getFrcsOutputs(testGroundMechWt);

  expect(parseFloat(res.total.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.total.costPerAcre.toFixed(7))).toBe(627.3814992);
  expect(parseFloat(res.total.costPerBoleCCF.toFixed(8))).toBe(63.00680825);
  expect(parseFloat(res.total.costPerGT.toFixed(8))).toBe(16.56235006);
  expect(parseFloat(res.total.dieselPerAcre.toFixed(7))).toBe(12.6485629);
  expect(parseFloat(res.total.dieselPerBoleCCF.toFixed(9))).toBe(1.270272678);
  expect(parseFloat(res.total.gasolinePerAcre.toFixed(9))).toBe(0.289099958);
  expect(parseFloat(res.total.gasolinePerBoleCCF.toFixed(9))).toBe(0.029033795);
  expect(parseFloat(res.total.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.total.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.residual.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.residual.costPerAcre.toFixed(7))).toBe(153.2614717);
  expect(parseFloat(res.residual.costPerBoleCCF.toFixed(8))).toBe(15.39177705);
  expect(parseFloat(res.residual.costPerGT.toFixed(9))).toBe(4.045975452);
  expect(parseFloat(res.residual.dieselPerAcre.toFixed(9))).toBe(4.409948082);
  expect(parseFloat(res.residual.dieselPerBoleCCF.toFixed(9))).toBe(0.442883243);
  expect(parseFloat(res.residual.gasolinePerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.gasolinePerBoleCCF.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testGroundManualWt', () => {
  const res = getFrcsOutputs(testGroundManualWt);

  expect(parseFloat(res.total.yieldPerAcre.toFixed(8))).toBe(37.87998061);
  expect(parseFloat(res.total.costPerAcre.toFixed(7))).toBe(784.1231539);
  expect(parseFloat(res.total.costPerBoleCCF.toFixed(8))).toBe(78.74809388);
  expect(parseFloat(res.total.costPerGT.toFixed(8))).toBe(20.70019945);
  expect(parseFloat(res.total.dieselPerAcre.toFixed(8))).toBe(13.94991762);
  expect(parseFloat(res.total.dieselPerBoleCCF.toFixed(9))).toBe(1.400965419);
  expect(parseFloat(res.total.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.total.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.total.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.total.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.residual.yieldPerAcre.toFixed(8))).toBe(11.55664724);
  expect(parseFloat(res.residual.costPerAcre.toFixed(7))).toBe(180.9851904);
  expect(parseFloat(res.residual.costPerBoleCCF.toFixed(8))).toBe(18.17602081);
  expect(parseFloat(res.residual.costPerGT.toFixed(9))).toBe(4.777858581);
  expect(parseFloat(res.residual.dieselPerAcre.toFixed(9))).toBe(4.353405622);
  expect(parseFloat(res.residual.dieselPerBoleCCF.toFixed(9))).toBe(0.437204785);
  expect(parseFloat(res.residual.gasolinePerAcre.toFixed(9))).toBe(0.139921192);
  expect(parseFloat(res.residual.gasolinePerBoleCCF.toFixed(9))).toBe(0.014052036);
  expect(parseFloat(res.residual.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testGroundManualLog', () => {
  const res = getFrcsOutputs(testGroundManualLog);

  expect(parseFloat(res.total.yieldPerAcre.toFixed(8))).toBe(32.77962505);
  expect(parseFloat(res.total.costPerAcre.toFixed(6))).toBe(1019.241489);
  expect(parseFloat(res.total.costPerBoleCCF.toFixed(7))).toBe(102.3606101);
  expect(parseFloat(res.total.costPerGT.toFixed(8))).toBe(31.09375068);
  expect(parseFloat(res.total.dieselPerAcre.toFixed(8))).toBe(12.28383479);
  expect(parseFloat(res.total.dieselPerBoleCCF.toFixed(9))).toBe(1.233643682);
  expect(parseFloat(res.total.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.total.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.total.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.total.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.residual.yieldPerAcre.toFixed(9))).toBe(6.456291679);
  expect(parseFloat(res.residual.costPerAcre.toFixed(7))).toBe(213.8010788);
  expect(parseFloat(res.residual.costPerBoleCCF.toFixed(8))).toBe(21.47166213);
  expect(parseFloat(res.residual.costPerGT.toFixed(9))).toBe(6.522377192);
  expect(parseFloat(res.residual.dieselPerAcre.toFixed(9))).toBe(3.461065049);
  expect(parseFloat(res.residual.dieselPerBoleCCF.toFixed(9))).toBe(0.347588608);
  expect(parseFloat(res.residual.gasolinePerAcre.toFixed(9))).toBe(0.152576795);
  expect(parseFloat(res.residual.gasolinePerBoleCCF.toFixed(9))).toBe(0.015323016);
  expect(parseFloat(res.residual.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});

test('testCableManualWtLog', () => {
  const res = getFrcsOutputs(testCableManualWtLog);

  expect(parseFloat(res.total.yieldPerAcre.toFixed(8))).toBe(34.17209172);
  expect(parseFloat(res.total.costPerAcre.toFixed(6))).toBe(1696.656652);
  expect(parseFloat(res.total.costPerBoleCCF.toFixed(7))).toBe(170.3922103);
  expect(parseFloat(res.total.costPerGT.toFixed(7))).toBe(49.6503599);
  expect(parseFloat(res.total.dieselPerAcre.toFixed(8))).toBe(23.37905983);
  expect(parseFloat(res.total.dieselPerBoleCCF.toFixed(9))).toBe(2.347917402);
  expect(parseFloat(res.total.gasolinePerAcre.toFixed(9))).toBe(0.774656782);
  expect(parseFloat(res.total.gasolinePerBoleCCF.toFixed(9))).toBe(0.077797403);
  expect(parseFloat(res.total.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.total.jetFuelPerBoleCCF.toFixed(0))).toBe(0);

  expect(parseFloat(res.residual.yieldPerAcre.toFixed(9))).toBe(7.848758345);
  expect(parseFloat(res.residual.costPerAcre.toFixed(7))).toBe(394.1303758);
  expect(parseFloat(res.residual.costPerBoleCCF.toFixed(8))).toBe(39.58181273);
  expect(parseFloat(res.residual.costPerGT.toFixed(8))).toBe(11.53369185);
  expect(parseFloat(res.residual.dieselPerAcre.toFixed(9))).toBe(5.611967166);
  expect(parseFloat(res.residual.dieselPerBoleCCF.toFixed(9))).toBe(0.563599882);
  expect(parseFloat(res.residual.gasolinePerAcre.toFixed(8))).toBe(0.12388653);
  expect(parseFloat(res.residual.gasolinePerBoleCCF.toFixed(9))).toBe(0.012441704);
  expect(parseFloat(res.residual.jetFuelPerAcre.toFixed(0))).toBe(0);
  expect(parseFloat(res.residual.jetFuelPerBoleCCF.toFixed(0))).toBe(0);
});
