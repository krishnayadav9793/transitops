// Service integration wrapper for outbound communications (e.g. license reminders)
import nodemailer from 'nodemailer';

// Mock SMTP Transporter structure. In production, provide config details in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_password'
  }
});

export const emailService = {
  /**
   * Sends an expiry alert for driver licenses
   * @param {string} toEmail - Target driver or safety officer address
   * @param {string} driverName - Name of the driver
   * @param {string} expiryDate - Expiration date string
   */
  sendLicenseExpiryAlert: async (toEmail, driverName, expiryDate) => {
    const mailOptions = {
      from: '"TransitOps Safety Alert" <safety@transitops.com>',
      to: toEmail,
      subject: `⚠️ WARNING: License Expiring for Driver ${driverName}`,
      text: `Hello,\n\nThis is a compliance warning that driver ${driverName}'s license is set to expire on ${expiryDate}.\n\nPlease update their profile credentials before this date to prevent dispatch interruptions.\n\nBest regards,\nTransitOps System`,
      html: `<h3>License Compliance Alert</h3><p>Driver <strong>${driverName}</strong>'s license will expire on <strong>${expiryDate}</strong>.</p><p>Please upload new documents to prevent dispatch service locks.</p>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT]: MessageID ${info.messageId} to ${toEmail}`);
      return info;
    } catch (error) {
      console.error('[EMAIL ERROR]: Failed to send mail notification', error);
      throw error;
    }
  }
};
