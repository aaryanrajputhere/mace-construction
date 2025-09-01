import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "config/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_ID = "YOUR_SHEET_ID";
const RFQ_TAB = "RFQs";

export const logRFQToSheet = async (
  rfqId: string,
  projectInfo: any,
  items: any[],
  vendors: any[],
  driveLinks: string[]
) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RFQ_TAB,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          rfqId,
          new Date().toISOString(),
          JSON.stringify(projectInfo),
          JSON.stringify(items),
          JSON.stringify(vendors),
          driveLinks.join(", "),
        ],
      ],
    },
  });
};
