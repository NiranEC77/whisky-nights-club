import { Resend } from 'resend'
import { PaymentMethod } from './types'

// Lazy initialization - only create when needed (not at build time)
let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY not configured - emails will not be sent')
      console.warn('Available env vars:', Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('EMAIL')))
      return null
    }
    console.log('✅ Resend client initialized with API key')
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

interface PaymentDetails {
  venmo?: string
  paypal?: string
  zelle?: { email: string; phone?: string }
  googlepay?: { email?: string; phone?: string }
}

function getPaymentDetails(): PaymentDetails {
  return {
    venmo: process.env.NEXT_PUBLIC_VENMO_USERNAME,
    paypal: process.env.NEXT_PUBLIC_PAYPAL_EMAIL,
    zelle: {
      email: process.env.NEXT_PUBLIC_ZELLE_EMAIL || '',
      phone: process.env.NEXT_PUBLIC_ZELLE_PHONE,
    },
    googlepay: {
      email: process.env.NEXT_PUBLIC_GOOGLEPAY_EMAIL,
      phone: process.env.NEXT_PUBLIC_GOOGLEPAY_PHONE,
    },
  }
}

function getPaymentInstructions(method: PaymentMethod, amount: number, memo: string): string {
  const details = getPaymentDetails()

  switch (method) {
    case 'paypal':
      return `
        <h2>💳 Payment Instructions</h2>
        <p>To complete your registration, please send payment via <strong>PayPal</strong>:</p>
        <p><strong>Send to:</strong> ${details.paypal || 'Not configured'}</p>
        <p><strong>Amount:</strong> <span class="highlight">$${amount.toFixed(2)}</span></p>
        <p><strong>Note:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">${memo}</code></p>
      `
    case 'stripe':
    default:
      return `
        <h2>💳 Payment Instructions</h2>
        <p>To complete your registration, you will receive a <strong>Stripe</strong> payment link:</p>
        <p><strong>Amount:</strong> <span class="highlight">$${amount.toFixed(2)}</span></p>
        <p><strong>Reference:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">${memo}</code></p>
        <p>A secure payment link will be sent to your email. Click the link to pay with credit/debit card.</p>
      `
  }
}

interface SendRegistrationEmailProps {
  to: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventPrice: number
  ticketCount: number
  attendeeName: string
  paymentMethod: PaymentMethod
  isFreeWithMembership: boolean
  registrationId: string
}

export async function sendRegistrationEmail({
  to,
  eventTitle,
  eventDate,
  eventTime,
  eventPrice,
  ticketCount,
  attendeeName,
  paymentMethod,
  isFreeWithMembership,
  registrationId,
}: SendRegistrationEmailProps) {
  console.log('📧 sendRegistrationEmail called')
  console.log('To:', to)
  console.log('Event:', eventTitle)
  console.log('Free with membership:', isFreeWithMembership)

  const resend = getResendClient()

  if (!resend) {
    console.error('❌ Resend not configured, skipping email send')
    return { error: 'Email service not configured' }
  }

  const totalPrice = eventPrice * ticketCount
  const ticketWord = ticketCount === 1 ? 'ticket' : 'tickets'
  const memo = `EVENT-${registrationId.substring(0, 8)}`

  console.log('📤 Attempting to send via Resend API...')

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Redhead Whiskey <events@redheadwhiskey.com>',
      to: [to],
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1919 0%, #2d2524 100%);
      color: #C6A667;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .detail-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #C6A667;
    }
    .payment-box {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 2px solid #C6A667;
    }
    .free-box {
      background: #e8f5e9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 2px solid #4caf50;
    }
    .highlight {
      color: #C6A667;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background: #C6A667;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 0;
    }
    h1, h2 {
      color: #C6A667;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🥃 Registration Confirmed!</h1>
  </div>
  
  <div class="content">
    <p>Hey ${attendeeName},</p>
    
    <p>You're all set! We've reserved your spot for <strong>${eventTitle}</strong>.</p>
    
    <div class="detail-box">
      <h2>Event Details</h2>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p><strong>Time:</strong> ${eventTime}</p>
      <p><strong>Tickets:</strong> ${ticketCount} ${ticketWord}</p>
      ${isFreeWithMembership
          ? '<p><strong>Price:</strong> <span style="color: #4caf50; font-weight: bold;">FREE with Membership! 🎉</span></p>'
          : `<p><strong>Total Amount:</strong> <span class="highlight">$${totalPrice.toFixed(2)}</span></p>`
        }
    </div>
    
    ${isFreeWithMembership
          ? `
      <div class="free-box">
        <h2 style="color: #4caf50;">✅ Membership Benefit Applied</h2>
        <p>This event is <strong>FREE</strong> as part of your yearly membership! No payment required.</p>
        <p>You're all confirmed and ready to go. See you there!</p>
      </div>
      `
          : `
      <div class="payment-box">
        ${getPaymentInstructions(paymentMethod, totalPrice, memo)}
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          ⚠️ <em>Important:</em> Please include the memo/note so we can match your payment to your registration.
        </p>
      </div>
      <p>Once we confirm your payment, you'll be all set! We'll send you a confirmation email.</p>
      `
        }
    
    <p style="margin-top: 30px;">Looking forward to tasting together!</p>
    
    <p>Cheers,<br>
    <strong>The Redhead Whiskey Team</strong></p>
  </div>
  
  <div class="footer">
    <p>Questions? Reply to this email and we'll be happy to help.</p>
    <p style="color: #999; font-size: 12px; margin-top: 10px;">
      This is an automated confirmation email for your event registration.
    </p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { error: error.message }
    }

    console.log('Registration email sent successfully:', data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Exception sending email:', error)
    return { error: error instanceof Error ? error.message : 'Failed to send email' }
  }
}

interface SendPaymentConfirmationProps {
  to: string
  attendeeName: string
  eventTitle: string
  eventDate: string
  eventTime: string
}

export async function sendPaymentConfirmation({
  to,
  attendeeName,
  eventTitle,
  eventDate,
  eventTime,
}: SendPaymentConfirmationProps) {
  const resend = getResendClient()

  if (!resend) {
    console.log('Resend not configured, skipping payment confirmation email')
    return { error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Redhead Whiskey <events@redheadwhiskey.com>',
      to: [to],
      subject: `Payment Confirmed: ${eventTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1919 0%, #2d2524 100%);
      color: #C6A667;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .success-box {
      background: #e8f5e9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #4caf50;
      text-align: center;
    }
    h1 {
      color: #C6A667;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Payment Confirmed!</h1>
  </div>
  
  <div class="content">
    <p>Hi ${attendeeName},</p>
    
    <div class="success-box">
      <h2 style="color: #4caf50; margin-top: 0;">You're All Set! 🎉</h2>
      <p>We've received your payment and confirmed your registration.</p>
    </div>
    
    <p><strong>Event:</strong> ${eventTitle}</p>
    <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p><strong>Time:</strong> ${eventTime}</p>
    
    <p style="margin-top: 30px;">See you there!</p>
    
    <p>Cheers,<br>
    <strong>The Redhead Whiskey Team</strong></p>
  </div>
  
  <div class="footer">
    <p>Questions? Reply to this email.</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending payment confirmation:', error)
      return { error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Exception sending payment confirmation:', error)
    return { error: error instanceof Error ? error.message : 'Failed to send email' }
  }
}

