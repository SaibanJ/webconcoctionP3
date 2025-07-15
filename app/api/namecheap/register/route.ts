import { NextRequest, NextResponse } from 'next/server';
import { checkDomainAvailability, registerDomain, ContactInfo } from '@/app/utils/namecheap';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      domain,
      years,
      registrantInfo,
      techInfo,
      adminInfo,
      auxInfo,
      nameservers,
      addFreeWhoisguard,
      enableWhoisguard
    } = body;

    // Validate required fields
    if (!domain) {
      return NextResponse.json(
        {
          success: false,
          message: 'Domain name is required'
        },
        { status: 400 }
      );
    }

    if (!years || isNaN(years) || years < 1 || years > 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Years must be a number between 1 and 10'
        },
        { status: 400 }
      );
    }

    if (!registrantInfo) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registrant information is required'
        },
        { status: 400 }
      );
    }

    // Validate registrant info
    const requiredFields = [
      'firstName',
      'lastName',
      'address1',
      'city',
      'stateProvince',
      'postalCode',
      'country',
      'phone',
      'emailAddress'
    ];

    for (const field of requiredFields) {
      if (!registrantInfo[field as keyof ContactInfo]) {
        return NextResponse.json(
          {
            success: false,
            message: `Registrant ${field} is required`
          },
          { status: 400 }
        );
      }
    }

    // Check if the domain is available before registering
    const availabilityCheck = await checkDomainAvailability([domain]);
    const isDomainAvailable = availabilityCheck.some((result: any) => 
      result.$.Domain === domain && result.$.Available === 'true'
    );

    if (!isDomainAvailable) {
      return NextResponse.json(
        {
          success: false,
          message: 'Domain is not available for registration'
        },
        { status: 400 }
      );
    }

    // Register the domain
    const result = await registerDomain(
      domain,
      years,
      registrantInfo,
      techInfo,
      adminInfo,
      auxInfo,
      nameservers,
      addFreeWhoisguard !== false, // Default to true if not specified
      enableWhoisguard !== false // Default to true if not specified
    );

    return NextResponse.json(
      {
        success: true,
        data: result
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering domain:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
