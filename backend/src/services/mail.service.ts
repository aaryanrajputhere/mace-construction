import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRFQEmails = async (
  rfqId: string,
  projectInfo: any,
  items: any[],
  vendors: { email: string }[],
  driveLinks: string[]
) => {
  for (const vendor of vendors) {
    const vendorName = "Vendor Name";
    const materialsList = items
      .map(
        (item, idx) =>
          `- ${item.name || item.description || `Item ${idx + 1}`}: ${
            item.size || ""
          }${item.size ? ", " : ""}${item.qty || ""}`
      )
      .join("<br>");
    await transporter.sendMail({
      from: "rfq@maceinfo.com",
      to: vendor.email,
      subject: `RFQ Request – ${projectInfo.name}, RFQ ID #${rfqId}`,
      html: `
        <p>Hello ${vendorName},</p>
        <p>We are requesting pricing and lead time for the following materials:</p>
        <p><strong>Project:</strong> ${projectInfo.name}</p>
        <p><strong>Site Address:</strong> ${projectInfo.address || ""}</p>
        <p><strong>Needed By:</strong> ${projectInfo.neededBy || ""}</p>
        <p><strong>Requested Materials:</strong><br>${materialsList}</p>
        <p>Files: ${driveLinks
          .map((l) => `<a href="${l}">File</a>`)
          .join(", ")}</p>
        <p>Please submit your pricing and lead time using the vendor reply link below:<br>
        <a href="https://yourapp.com/vendor-reply/${rfqId}">Vendor Reply Form Link</a></p>
        <p>Thank you,<br>Maceinfo RFQ System<br>rfq@maceinfo.com</p>
      `,
    });
  }
};
