import { getFrcsOutputs } from './index';
import { testGroundMechWt } from './test.data';

// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary?noredirect=1&lq=1
function roundToNdecimal(num: number, n: number) {
  const x = 10 ** n;
  return Math.round((num + Number.EPSILON) * x) / x;
}

test('testGroundMechWt', () => {
  const res = getFrcsOutputs(testGroundMechWt);

  expect(roundToNdecimal(res.total.yieldPerAcre, 8)).toBe(37.87998061);
  expect(roundToNdecimal(res.total.costPerAcre, 7)).toBe(627.3814992);
  expect(roundToNdecimal(res.total.costPerBoleCCF, 8)).toBe(63.00680825);
  expect(roundToNdecimal(res.total.costPerGT, 8)).toBe(16.56235006);
  expect(roundToNdecimal(res.total.dieselPerAcre, 7)).toBe(12.6485629);
  expect(roundToNdecimal(res.total.dieselPerBoleCCF, 9)).toBe(1.270272678);
  expect(roundToNdecimal(res.total.gasolinePerAcre, 9)).toBe(0.289099958);
  expect(roundToNdecimal(res.total.gasolinePerBoleCCF, 9)).toBe(0.029033795);
  expect(roundToNdecimal(res.total.jetFuelPerAcre, 0)).toBe(0);
  expect(roundToNdecimal(res.total.jetFuelPerBoleCCF, 0)).toBe(0);

  expect(roundToNdecimal(res.residual.yieldPerAcre, 8)).toBe(11.55664724);
  expect(roundToNdecimal(res.residual.costPerAcre, 7)).toBe(153.2614717);
  expect(roundToNdecimal(res.residual.costPerBoleCCF, 8)).toBe(15.39177705);
  expect(roundToNdecimal(res.residual.costPerGT, 9)).toBe(4.045975452);
  expect(roundToNdecimal(res.residual.dieselPerAcre, 9)).toBe(4.409948082);
  expect(roundToNdecimal(res.residual.dieselPerBoleCCF, 9)).toBe(0.442883243);
  expect(roundToNdecimal(res.residual.gasolinePerAcre, 0)).toBe(0);
  expect(roundToNdecimal(res.residual.gasolinePerBoleCCF, 0)).toBe(0);
  expect(roundToNdecimal(res.residual.jetFuelPerAcre, 0)).toBe(0);
  expect(roundToNdecimal(res.residual.jetFuelPerBoleCCF, 0)).toBe(0);
});
