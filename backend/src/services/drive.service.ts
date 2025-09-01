import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "config/credentials.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadFilesToDrive = async (files: Express.Multer.File[]) => {
  const links: string[] = [];

  for (const file of files) {
    const response = await drive.files.create({
      requestBody: { name: file.originalname, parents: ["YOUR_FOLDER_ID"] },
      media: { mimeType: file.mimetype, body: Buffer.from(file.buffer) },
      fields: "id",
    });

    const fileId = response.data.id!;
    links.push(`https://drive.google.com/file/d/${fileId}/view`);
  }

  return links;
};
