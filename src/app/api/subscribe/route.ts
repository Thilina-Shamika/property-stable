import { NextResponse } from 'next/server';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.length) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
      return NextResponse.json(
        { error: 'Mailchimp configuration is missing' },
        { status: 500 }
      );
    }

    try {
      const API_KEY = MAILCHIMP_API_KEY;
      const AUDIENCE_ID = MAILCHIMP_AUDIENCE_ID;
      const DATACENTER = MAILCHIMP_SERVER_PREFIX;
      const API_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

      const data = {
        email_address: email,
        status: 'subscribed',
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }

      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter!' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Mailchimp API Error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 