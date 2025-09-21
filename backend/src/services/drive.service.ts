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
 * Set file permissions to be accessible with link only
 */
const makeFileAccessibleWithLink = async (fileId: string): Promise<void> => {
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });
};

/**
 * Upload files into a Shared Drive folder and make them accessible with link
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

    // Make file accessible with link only
    await makeFileAccessibleWithLink(fileId);

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

/**
 * Upload files for vendor reply with structured folder hierarchy
 */
const uploadVendorReplyFiles = async (
  itemFiles: { [itemId: string]: Express.Multer.File[] },
  itemFolderIds: { [itemId: string]: string }
): Promise<{ [itemId: string]: string[] }> => {
  const result: { [itemId: string]: string[] } = {};

  for (const [itemId, files] of Object.entries(itemFiles)) {
    if (files.length > 0 && itemFolderIds[itemId]) {
      const fileLinks = await uploadFilesToFolder(files, itemFolderIds[itemId]);
      result[itemId] = fileLinks;
    } else {
      result[itemId] = [];
    }
  }

  return result;
};

/**
 * Create vendor reply folder structure and upload files
 * Creates: vendor-replies/Reply-{replyId}/Item-{itemId}/ for each item with files
 */
export const saveVendorReplyFiles = async (
  replyId: string,
  itemFiles: { [itemId: string]: Express.Multer.File[] }
): Promise<{
  replyFolderLink: string;
  itemFolderLinks: { [itemId: string]: string };
  itemFileLinks: { [itemId: string]: string[] };
}> => {
  // ✅ Parent folder for vendor replies (should be created in your Drive)
  const VENDOR_REPLIES_FOLDER_ID = process.env.VENDOR_REPLIES_FOLDER_ID || "";

  // Create main reply folder
  const replyFolderId = await createDriveFolder(
    `Reply-${replyId}`,
    VENDOR_REPLIES_FOLDER_ID
  );
  const replyFolderLink = `https://drive.google.com/drive/folders/${replyFolderId}`;

  // Make reply folder accessible with link
  await makeFileAccessibleWithLink(replyFolderId);

  // Create item subfolders for items that have files
  const itemFolderIds: { [itemId: string]: string } = {};
  const itemFolderLinks: { [itemId: string]: string } = {};

  for (const itemId of Object.keys(itemFiles)) {
    if (itemFiles[itemId].length > 0) {
      const itemFolderId = await createDriveFolder(
        `Item-${itemId}`,
        replyFolderId
      );
      itemFolderIds[itemId] = itemFolderId;
      itemFolderLinks[
        itemId
      ] = `https://drive.google.com/drive/folders/${itemFolderId}`;

      // Make item folder accessible with link
      await makeFileAccessibleWithLink(itemFolderId);
    }
  }

  // Upload files to respective item folders
  const itemFileLinks = await uploadVendorReplyFiles(itemFiles, itemFolderIds);

  return {
    replyFolderLink,
    itemFolderLinks,
    itemFileLinks,
  };
};
