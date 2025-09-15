// mail.service.manual.test.ts
import { sendRFQEmail } from "./mail.service";

// Dummy data
const rfqId = "test123";
const projectInfo = {
  name: "Manual Test Project",
  address: "Test Address",
  neededBy: "Tomorrow",
};
const items = [{ name: "TestItem", size: "Medium", qty: 1 }];
const vendor = { email: "aaryanrajput3.14@gmail.com", name: "Test Vendor" };
const driveLinks = ["http://testfile"];

(async () => {
  try {
    await sendRFQEmail(rfqId, projectInfo, items, vendor, driveLinks);
    console.log("sendRFQEmail executed successfully");
  } catch (err) {
    console.error("Error executing sendRFQEmail:", err);
  }
})();
