import { GoogleSpreadsheet } from "google-spreadsheet";

import googleConfig from "../google.js";

class DB {
  async init() {
    this.spreadSheet = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
    await this.spreadSheet.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: googleConfig.private_key,
    });

    await this.spreadSheet.loadInfo();
    const sheet = this.spreadSheet.sheetsByIndex[0];

    const rows = await sheet.getRows(); // can pass in { limit, offset }
  }

  async addMovies({ title, genreIds, link }) {
    await this.spreadSheet.loadInfo();

    const sheet = this.spreadSheet.sheetsByIndex[0];

    const moreRows = await sheet.addRows([
      { title: "Sergey Brin", link: "sergey@google.com" },
      { title: "Eric Schmidt", link: "eric@google.com" },
    ]);

    console.log({ moreRows });
  }

  async getAllMovies(options) {
    await this.spreadSheet.loadInfo();

    const sheet = this.spreadSheet.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let data = rows;

    if (options) {
      const { offset, limit } = options;
      console.log("DBBB", offset * limit, offset * limit + limit);
      data = rows.slice(offset * limit, offset * limit + limit);
    }

    const preparedData = data.map((r) => ({
      title: r.title + ` (${r.id})`,
      link: r.link,
      genreId: r.genreId,
      id: r.id,
    }));

    return {
      data: preparedData,
      total: rows.length,
    };
  }

  async getMovieById(id) {
    await this.spreadSheet.loadInfo();

    const sheet = this.spreadSheet.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const data = rows.find((r) => r.id === id) ?? null;

    return data;
  }
}

export const db = new DB();
