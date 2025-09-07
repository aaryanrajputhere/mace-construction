import { google } from "googleapis";
import path from "path";

let auth: any;

/**
 * Singleton GoogleAuth instance
 */
export const getGoogleAuth = () => {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../../service-account.json"), // adjust path if needed
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/gmail.send", // only if you use Gmail API
      ],
    });
  }
  return auth;
};

/**
 * Helpers to get clients
 */
export const getDriveClient = () => {
  return google.drive({ version: "v3", auth: getGoogleAuth() });
};

export const getSheetsClient = () => {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
};

export const getGmailClient = () => {
  return google.gmail({ version: "v1", auth: getGoogleAuth() });
};
