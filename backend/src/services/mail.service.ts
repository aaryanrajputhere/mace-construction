import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SECRET = process.env.JWT_SECRET || "supersecret"; // put in env

export const sendRFQEmails = async (
  rfqId: string,
  projectInfo: any,
  items: any[],
  vendors: { email: string; name: string }[], // using name + email
  driveLinks: string[]
) => {
  for (const vendor of vendors) {
    // 🔑 Create token per vendor (use name + email for uniqueness)
    const token = jwt.sign(
      { vendorName: vendor.name, vendorEmail: vendor.email, rfqId }, // payload
      SECRET,
      { expiresIn: "7d" }
    );

    const secureLink = `https://mace-construction.vercel.app/vendor-reply/${rfqId}/${token}`;

    const materialsList = items
      .map(
        (item, idx) =>
          `- ${item.name || item.description || `Item ${idx + 1}`}: ${
            item.size || ""
          }${item.size ? ", " : ""}${item.qty || ""}`
      )
      .join("<br>");
    console.log("Email sent to : ", vendor.email);
    await transporter.sendMail({
      from: "rfq@maceinfo.com",
      to: vendor.email,
      subject: `RFQ Request – ${projectInfo.name}, RFQ ID #${rfqId}`,
      html: `
        <p>Hello ${vendor.name},</p>
        <p>We are requesting pricing and lead time for the following materials:</p>
        <p><strong>Project:</strong> ${projectInfo.name}</p>
        <p><strong>Site Address:</strong> ${projectInfo.address || ""}</p>
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
    });
  }
};
