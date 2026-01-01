'use server';

import nodemailer from 'nodemailer';
import env from '@/app/utils/env.config';

interface SendAssessmentEmailProps {
    to: string;
    userName: string;
    hireableStatus: string;
    strengths?: string[];
    weaknesses?: string[];
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.GMAIL,
        pass: env.APP_PASSWORD,
    },
});

export async function sendAssessmentEmail({
    to,
    userName,
    hireableStatus,
    strengths = [],
    weaknesses = [],
}: SendAssessmentEmailProps) {
    try {
        console.log(`📧 Sending assessment email to ${to} for ${userName}`);

        const getStatusText = (status: string) => {
            switch (status) {
                case 'hireable': return 'Hireable';
                case 'near_hireable': return 'Near Hireable';
                case 'unhireable': return 'Unhireable';
                default: return 'Not Assessed';
            }
        };

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'hireable': return '#16a34a'; // green-600
                case 'near_hireable': return '#ca8a04'; // yellow-600
                case 'unhireable': return '#dc2626'; // red-600
                default: return '#4b5563'; // gray-600
            }
        };

        const statusText = getStatusText(hireableStatus);
        const statusColor = getStatusColor(hireableStatus);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #000; }
                    .status-box { padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px; text-align: center; }
                    .status-label { font-size: 14px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
                    .status-value { font-size: 24px; font-weight: bold; color: ${statusColor}; }
                    .section { margin-bottom: 24px; }
                    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; }
                    .list-item { margin-bottom: 8px; padding-left: 12px; border-left: 3px solid #e5e7eb; }
                    .strength-item { border-left-color: #16a34a; }
                    .weakness-item { border-left-color: #dc2626; }
                    .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Intake</div>
                        <p style="font-size: 12px; color: #666;">powered by Beyond Technologies Private Limited</p>
                        <p style="margin-top: 15px;">Feedback on your profile and submission</p>
                    </div>

                    <p>Hi ${userName},</p>
                    <p>We've reviewed your profile and video submission. Here is our assessment of your current hireability status along with specific feedback.</p>

                    <div class="status-box">
                        <div class="status-label">Current Status</div>
                        <div class="status-value">${statusText}</div>
                    </div>

                    ${strengths.length > 0 ? `
                        <div class="section">
                            <div class="section-title">Key Strengths</div>
                            ${strengths.map(s => `<div class="list-item strength-item">${s}</div>`).join('')}
                        </div>
                    ` : ''}

                    ${weaknesses.length > 0 ? `
                        <div class="section">
                            <div class="section-title">Areas for Improvement</div>
                            ${weaknesses.map(w => `<div class="list-item weakness-item">${w}</div>`).join('')}
                        </div>
                    ` : ''}

                    ${weaknesses.length > 0 ? `
                        <div class="section">
                            <div class="section-title">Areas for Improvement</div>
                            ${weaknesses.map(w => `<div class="list-item weakness-item">${w}</div>`).join('')}
                        </div>
                    ` : ''}

                    <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
                        <p style="margin-bottom: 15px; font-weight: bold; color: #16a34a;">Want to accelerate your growth?</p>
                        <a href="https://wa.me/9526965228" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            Join Our Exclusive Program on WhatsApp
                        </a>
                    </div>

                    <div class="footer">
                        <p>This is an automated message from the Intake team.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Intake Team" <${env.GMAIL}>`,
            to,
            subject: `Your Intake Assessment Results: ${statusText}`,
            html: htmlContent,
        });

        console.log('✅ Email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
