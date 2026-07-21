import { CURRENCIES } from "@/components/currency/CurrencyProvider";

describe("Multi-Currency Support Logic", () => {
  it("should have correct currency configurations", () => {
    expect(CURRENCIES.USD).toBeDefined();
    expect(CURRENCIES.MMK).toBeDefined();
    expect(CURRENCIES.EUR).toBeDefined();
    expect(CURRENCIES.GBP).toBeDefined();
    expect(CURRENCIES.THB).toBeDefined();

    expect(CURRENCIES.USD.rate).toBe(1.0);
    expect(CURRENCIES.MMK.rate).toBe(3500.0);
  });

  it("should convert USD amounts correctly according to exchange rates", () => {
    const usdAmount = 100;

    const mmkConverted = usdAmount * CURRENCIES.MMK.rate;
    expect(mmkConverted).toBe(350000);

    const eurConverted = usdAmount * CURRENCIES.EUR.rate;
    expect(eurConverted).toBe(92);

    const gbpConverted = usdAmount * CURRENCIES.GBP.rate;
    expect(gbpConverted).toBe(78);

    const thbConverted = usdAmount * CURRENCIES.THB.rate;
    expect(thbConverted).toBe(3650);
  });
});
