import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
const SECRET = process.env.JWT_SECRET || "supersecret"; // put in env

export const sendRFQEmail = async (
  rfqId: string,
  projectInfo: any,
  items: any[],
  vendor: { email: string; name: string },
  driveLinks: string[]
) => {
  const token = jwt.sign(
    { vendorName: vendor.name, vendorEmail: vendor.email, rfqId },
    SECRET,
    { expiresIn: "7d" }
  );

  const secureLink = `https://mace-construction.vercel.app/vendor-reply/${rfqId}/${token}`;

  const materialsList = items
    .map(
      (item, idx) =>
        `- ${
          item["Item Name"] ||
          item.name ||
          item.description ||
          `Item ${idx + 1}`
        }: ` +
        `${item["Size/Option"] || item.size || ""}${
          item["Size/Option"] || item.size ? ", " : ""
        }` +
        `${item["Unit"] || item.unit || ""}${
          item["Unit"] || item.unit ? ", " : ""
        }` +
        `Qty: ${item["Quantity"] || item.qty || ""}`
    )
    .join("<br>");

  console.log("Sending Email to:", vendor.email);
  const msg = {
    to: vendor.email, // Send to actual vendor
    from: "rfq@maceinfo.com", // Verified sender
    subject: `RFQ Request – ${projectInfo.projectName}, RFQ ID #${rfqId}`,
    html: `
      <p>Hello ${vendor.name},</p>
      <p>We are requesting pricing and lead time for the following materials:</p>
      <p><strong>Project:</strong> ${projectInfo.projectName}</p>
      <p><strong>Site Address:</strong> ${projectInfo.siteAddress || ""}</p>
      <p><strong>Needed By:</strong> ${projectInfo.neededBy || ""}</p>
      <p><strong>Requested Materials:</strong><br>${materialsList}</p>
      <p>Files: ${driveLinks
        .map((l) => `<a href="${l}">File</a>`)
        .join(", ")}</p>
      <p>Please submit your pricing and lead time using your secure vendor link below:<br>
      <a href="${secureLink}">Submit Your Reply</a></p>
      <p>This link is unique to you and will expire in 7 days.</p>
      <p>Thank you,<br>Maceinfo RFQ System<br>rfq@maceinfo.com</p>
    `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
