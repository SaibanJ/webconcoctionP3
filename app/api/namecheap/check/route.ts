import { NextRequest, NextResponse } from 'next/server';
import { checkDomainAvailability } from '@/app/utils/namecheap';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domains } = body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide an array of domain names to check'
        },
        { status: 400 }
      );
    }

    const results = await checkDomainAvailability(domains);
    
    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
