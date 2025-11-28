"use server";

interface SendOrderUpdateEmailParams {
  orderId: string;
  customerEmail: string;
  customerName: string;
  changeDescription: string;
}

export async function sendOrderUpdateEmail({
  orderId,
  customerEmail,
  customerName,
  changeDescription,
}: SendOrderUpdateEmailParams) {
  // Mock email sending
  console.log("---------------------------------------------------");
  console.log(`[MOCK EMAIL] Sending Order Update to ${customerEmail}`);
  console.log(`Subject: Update regarding your order #${orderId}`);
  console.log(`Hi ${customerName},`);
  console.log(`We wanted to let you know about a change to your order #${orderId}:`);
  console.log(changeDescription);
  console.log("If you have any questions, please reply to this email.");
  console.log("Best regards,\nBand of Bakers");
  console.log("---------------------------------------------------");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}
