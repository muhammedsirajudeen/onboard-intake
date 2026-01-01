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
                default: return 'Pending Review';
            }
        };

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'hireable': return '#059669'; // emerald-600
                case 'near_hireable': return '#d97706'; // amber-600
                case 'unhireable': return '#e11d48'; // rose-600
                default: return '#4b5563'; // gray-600
            }
        };

        const getStatusBgColor = (status: string) => {
            switch (status) {
                case 'hireable': return '#ecfdf5'; // emerald-50
                case 'near_hireable': return '#fffbeb'; // amber-50
                case 'unhireable': return '#fff1f2'; // rose-50
                default: return '#f9fafb'; // gray-50
            }
        };

        const getProgramDetails = (status: string) => {
            switch (status) {
                case 'hireable':
                    return {
                        name: "1% Engineer Club",
                        price: "₹1299",
                        outcome: "Direct referrals, salary negotiation, and access to elite networking."
                    };
                case 'near_hireable':
                    return {
                        name: "Senior Engineer Mindset",
                        price: "₹999",
                        outcome: "Learn system design, advanced patterns, and how to unblock yourself."
                    };
                case 'unhireable':
                default:
                    return {
                        name: "Foundation Architect",
                        price: "₹799",
                        outcome: "Master the basics and build your first real project. Stop copying tutorials."
                    };
            }
        };

        const statusText = getStatusText(hireableStatus);
        const statusColor = getStatusColor(hireableStatus);
        const statusBg = getStatusBgColor(hireableStatus);
        const program = getProgramDetails(hireableStatus);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0; background-color: #f3f4f6; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .header { padding: 24px; text-align: center; border-bottom: 1px solid #f3f4f6; }
                    .logo-main { font-size: 24px; font-weight: 800; color: #111827; line-height: 1; display: block; }
                    .logo-sub { font-size: 10px; color: #00D084; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-top: -2px; }
                    
                    .content { padding: 32px 24px; }
                    .greeting { font-size: 16px; margin-bottom: 24px; color: #374151; }
                    
                    .status-card { background-color: ${statusBg}; border: 1px solid ${statusColor}30; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px; }
                    .status-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-bottom: 8px; background: rgba(255,255,255,0.5); display: inline-block; padding: 4px 12px; border-radius: 100px; }
                    .status-value { font-size: 36px; font-weight: 900; color: ${statusColor}; line-height: 1.1; margin: 12px 0 8px; letter-spacing: -1px; }
                    .status-desc { font-size: 14px; color: #4b5563; max-width: 280px; margin: 0 auto; }

                    .cta-card { background-color: #111827; border-radius: 16px; padding: 32px 24px; text-align: center; color: #ffffff; margin-bottom: 32px; }
                    .cta-program { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
                    .cta-price { font-size: 32px; font-weight: 900; margin-bottom: 16px; color: #ffffff; }
                    .cta-outcome-box { background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left; }
                    .cta-outcome-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; display: block; margin-bottom: 4px; }
                    .cta-outcome-text { font-size: 14px; line-height: 1.4; color: #f3f4f6; }
                    .cta-button { display: block; width: 100%; background-color: #00D084; color: #ffffff; font-weight: 700; text-decoration: none; padding: 16px; border-radius: 50px; text-align: center; font-size: 16px; }
                    
                    .section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #f3f4f6; }
                    .feedback-grid { margin-bottom: 32px; }
                    .feedback-item { background-color: #f9fafb; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 14px; color: #374151; }
                    .feedback-item.strength { border-left: 4px solid #059669; }
                    .feedback-item.weakness { border-left: 4px solid #e11d48; }

                    .footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <span class="logo-main">Intake</span>
                        <span class="logo-sub">by onboard</span>
                    </div>

                    <div class="content">
                        <p class="greeting">Hi ${userName},</p>
                        <p style="color: #6b7280; margin-bottom: 24px;">Your implementation has been reviewed. Here is your official signal report.</p>

                        <div class="status-card">
                            <div class="status-label">Official Status</div>
                            <div class="status-value">${statusText}</div>
                        </div>

                        <div class="cta-card">
                            <div style="font-size: 10px; font-weight: 700; color: #00D084; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Recommended Program</div>
                            <div class="cta-program">${program.name}</div>
                            <div class="cta-price">${program.price}</div>
                            
                            <div class="cta-outcome-box">
                                <span class="cta-outcome-label">The Outcome</span>
                                <span class="cta-outcome-text">${program.outcome}</span>
                            </div>

                            <a href="https://wa.me/9526965228" class="cta-button">Join Exclusive Program</a>
                        </div>

                        ${strengths.length > 0 ? `
                            <div class="feedback-grid">
                                <div class="section-title">Identified Strengths</div>
                                ${strengths.map(s => `<div class="feedback-item strength">${s}</div>`).join('')}
                            </div>
                        ` : ''}

                        ${weaknesses.length > 0 ? `
                            <div class="feedback-grid">
                                <div class="section-title">Critical Gaps</div>
                                ${weaknesses.map(w => `<div class="feedback-item weakness">${w}</div>`).join('')}
                            </div>
                        ` : ''}

                    </div>

                    <div class="footer">
                        <p>&copy; 2026 Intake. All rights reserved.</p>
                        <p>Powered by Beyond Technologies Private Limited</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Intake Team" <${env.GMAIL}>`,
            to,
            subject: `Your Intake Signal: ${statusText}`,
            html: htmlContent,
        });

        console.log('✅ Email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
