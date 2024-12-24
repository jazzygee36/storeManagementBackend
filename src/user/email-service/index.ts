import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import * as dotenv from 'dotenv';

dotenv.config(); // This loads the .env file

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Set up the email transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can choose your email service provider
      auth: {
        user: process.env.EMAIL_USER || 'jazzygee36@gmail.com', // Replace with your email
        pass: (process.env.EMAIL_PASSWORD as string) || 'wmtw uycf vqdr jtlw', // Replace with your email password (or app password)
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    const mailOptions = {
      from: 'jazzygee36@gmail.com', // Sender address
      to: email, // Receiver's email address
      subject: 'Email Verification', // Subject line
      text: `Please click the following link to verify your email: ${verificationLink}`, // Plain text body
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}
