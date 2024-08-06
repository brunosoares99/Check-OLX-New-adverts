import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({ puppeteer: { headless: true } });

type House = {
  order: number;
  link: string;
  date: string;
};

const lastHouses: House[] = [];

client.once("ready", () => {
  console.log("Client is ready!");
  async function checkForUpdates() {
    console.log("Checking for updates...");
    puppeteer
      .use(StealthPlugin())
      .launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      })
      .then(async (browser) => {
        const page = await browser.newPage();
        if (!process.env.URL_WITH_FILTERS) return;
        await page.goto(process.env.URL_WITH_FILTERS);
        await page.waitForSelector(".olx-ad-card.olx-ad-card--horizontal");
        const data: House[] = await page.evaluate(() => {
          const elements = document.querySelectorAll(
            ".olx-ad-card.olx-ad-card--horizontal"
          );
          const properties: House[] = [];
          elements.forEach((element, index) => {
            const link = element.querySelector("a")?.getAttribute("href");
            const date = element.querySelector(
              ".olx-text.olx-text--caption.olx-text--block.olx-text--regular.olx-ad-card__date--horizontal"
            )?.textContent;
            properties.push({
              order: index + 1,
              link: link ?? "",
              date: date ?? "",
            });
          });

          return properties || [];
        });

        const dataWithGetValue = data.slice(
          0,
          Number(process.env.QUANTITY_TO_GET) || 5
        );

        const onlyNewHouses = dataWithGetValue.filter(
          (house) =>
            !lastHouses.some((lastHouse) => lastHouse.link === house.link)
        );
        if (onlyNewHouses.length === 0) {
          await browser.close();
          return;
        }

        lastHouses.push(...onlyNewHouses);
        lastHouses.shift();
        if (process.env.PHONE_TO_ID) {
          await client.sendMessage(
            process.env.PHONE_TO_ID,
            `Novos imóveis encontrados: \n  ${onlyNewHouses
              .map((house) => {
                return `Imóvel ${house.order}: \n ${house.link} \n ${
                  house.date ?? ""
                } \n`;
              })
              .join("")}`
          );
        }

        await browser.close();
      });
  }

  checkForUpdates();
  setInterval(
    checkForUpdates,
    Number(process.env.TIME_TO_SEARCH || 10) * 60 * 1000
  );
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.initialize();
