import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export interface CertificateApprovalEmailData {
  userName: string
  userEmail: string
  certificateTitle: string
  semester: string
  submissionDate: string
  approvedBy: string
  remark?: string
}

export async function sendCertificateApprovalEmail(data: CertificateApprovalEmailData) {
  try {
    const { userName, userEmail, certificateTitle, semester, submissionDate, approvedBy, remark } = data

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg,rgb(102, 214, 234) 0%,rgb(5, 226, 255) 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Certificate Approved!</h1>
          <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Your certificate submission has been approved</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Dear ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Great news! Your certificate submission has been <strong style="color: #28a745;">approved</strong> by our personnel.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">Certificate Details:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Certificate Type:</strong> ${certificateTitle}</li>
              <li><strong>Semester:</strong> ${semester}</li>
              <li><strong>Submission Date:</strong> ${submissionDate}</li>
              <li><strong>Approved By:</strong> ${approvedBy}</li>
            </ul>
          </div>
          
          ${remark ? `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <h4 style="color: #1976d2; margin-top: 0;">Additional Remarks:</h4>
              <p style="color: #555; margin: 0; font-style: italic;">"${remark}"</p>
            </div>
          ` : ''}
          
          <p style="color: #555; line-height: 1.6;">
            You can now access your approved certificate through your dashboard. If you have any questions or need further assistance, please don't hesitate to contact our support team.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://masetrack.vercel.app'}/dashboard/submissions" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Your Certificates
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
          
          <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
            This is an automated message from the MASE Track system.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    `

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables')
      return { success: false, error: 'RESEND_API_KEY is not configured' }
    }

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: 'MASE Track <onboarding@resend.dev>', // Using Resend's default domain for testing
      to: [userEmail],
      subject: `Certificate Approved - ${certificateTitle}`,
      html: emailContent,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending approval email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function sendCertificateRejectionEmail(data: Omit<CertificateApprovalEmailData, 'approvedBy'> & { rejectedBy: string }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables')
      return { success: false, error: 'RESEND_API_KEY is not configured' }
    }

    const { userName, userEmail, certificateTitle, semester, submissionDate, rejectedBy, remark } = data

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Certificate Update</h1>
          <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Your certificate submission requires attention</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Dear ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            We've reviewed your certificate submission and it requires some adjustments before it can be approved.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #333; margin-top: 0;">Certificate Details:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Certificate Type:</strong> ${certificateTitle}</li>
              <li><strong>Semester:</strong> ${semester}</li>
              <li><strong>Submission Date:</strong> ${submissionDate}</li>
              <li><strong>Reviewed By:</strong> ${rejectedBy}</li>
            </ul>
          </div>
          
          ${remark ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin-top: 0;">Feedback:</h4>
              <p style="color: #555; margin: 0;">${remark}</p>
            </div>
          ` : ''}
          
          <p style="color: #555; line-height: 1.6;">
            Please review the feedback above and resubmit your certificate with the necessary corrections. If you have any questions, please contact our support team.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/submit-certificate" 
               style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Resubmit Certificate
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
          
          <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
            This is an automated message from the MASE Track system.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    `

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: 'MASE Track <onboarding@resend.dev>', // Using Resend's default domain for testing
      to: [userEmail],
      subject: `Certificate Update Required - ${certificateTitle}`,
      html: emailContent,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending rejection email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
