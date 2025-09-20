import { google } from "googleapis";
import { Readable } from "stream";
import { getGoogleAuth } from "../utils/googleAuth"; // common auth

const drive = google.drive({ version: "v3", auth: getGoogleAuth() });

// ✅ Helper: convert Buffer to Stream
function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Create a subfolder in "rfq-uploads" inside the Shared Drive
 */
const createDriveFolder = async (
  folderName: string,
  parentFolderId: string
): Promise<string> => {
  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    supportsAllDrives: true, // ✅ required for Shared Drives
    fields: "id",
  });

  return response.data.id!;
};

/**
 * Upload files into a Shared Drive folder
 */
const uploadFilesToFolder = async (
  files: Express.Multer.File[],
  folderId: string
): Promise<string[]> => {
  const links: string[] = [];

  for (const file of files) {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferToStream(file.buffer),
      },
      supportsAllDrives: true, // ✅ important for Shared Drives
      fields: "id",
    });

    const fileId = response.data.id!;
    const link = `https://drive.google.com/file/d/${fileId}/view`;
    links.push(link);
  }

  return links;
};

/**
 * Main function: create RFQ subfolder inside "rfq-uploads" and upload files
 */
export const saveRFQFiles = async (
  files: Express.Multer.File[],
  rfqId: string
): Promise<{ folderLink: string; fileLinks: string[] }> => {
  // ✅ Parent is your "rfq-uploads" folder inside Shared Drive
  const DRIVE_PARENT_FOLDER_ID = process.env.DRIVE_PARENT_FOLDER_ID || "";
  const folderId = await createDriveFolder(
    `RFQ-${rfqId}`,
    DRIVE_PARENT_FOLDER_ID
  );
  const folderLink = `https://drive.google.com/drive/folders/${folderId}`;

  // Upload files
  const fileLinks = files.length
    ? await uploadFilesToFolder(files, folderId)
    : [];

  return { folderLink, fileLinks };
};

