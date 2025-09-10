import { google } from "googleapis";

let auth: any;

export const getGoogleAuth = () => {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/gmail.send",
      ],
    });
  }
  return auth;
};

export const getDriveClient = () => {
  return google.drive({ version: "v3", auth: getGoogleAuth() });
};

export const getSheetsClient = () => {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
};

export const getGmailClient = () => {
  return google.gmail({ version: "v1", auth: getGoogleAuth() });
};
