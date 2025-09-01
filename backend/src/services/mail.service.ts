import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "your-email@gmail.com", pass: "your-app-password" },
});

export const sendRFQEmails = async (
  rfqId: string,
  projectInfo: any,
  items: any[],
  vendors: { email: string }[],
  driveLinks: string[]
) => {
  for (const vendor of vendors) {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: vendor.email,
      subject: `New RFQ: ${rfqId}`,
      html: `
        <h3>Request for Quote: ${rfqId}</h3>
        <p>Project: ${projectInfo.name}</p>
        <p><strong>Items:</strong></p>
        <pre>${JSON.stringify(items, null, 2)}</pre>
        <p>Files: ${driveLinks
          .map((l) => `<a href="${l}">File</a>`)
          .join(", ")}</p>
        <p><a href="https://yourapp.com/vendor-reply/${rfqId}">Reply Here</a></p>
      `,
    });
  }
};
