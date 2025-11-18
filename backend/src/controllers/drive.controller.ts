import { google } from "googleapis";
import { Readable } from "stream";
import { getGoogleAuth } from "../utils/googleAuth";

const drive = google.drive({ version: "v3", auth: getGoogleAuth() });

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const uploadFilesToFolder = async (
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

    // Note: Permissions are inherited from parent folder in Shared Drives
    // No need to set individual file permissions

    const link = `https://drive.google.com/file/d/${fileId}/view`;
    links.push(link);
  }

  return links;
};
