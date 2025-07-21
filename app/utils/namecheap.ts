import axios from "axios"
import { parseString } from "xml2js"
import { promisify } from "util"

// Convert parseString to Promise-based function
const parseStringPromise = promisify(parseString)

// API URLs
const SANDBOX_API_URL = "https://api.sandbox.namecheap.com/xml.response"
const PRODUCTION_API_URL = "https://api.namecheap.com/xml.response"

/**
 * Makes a request to the Namecheap API
 * @param command The API command to execute
 * @param params Additional parameters for the command
 * @returns The parsed API response
 */
export async function makeNamecheapApiRequest(command: string, params: Record<string, string> = {}) {
  // Namecheap API configuration
  const apiUser = process.env.NAMECHEAP_USERNAME;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP;
  const userName = process.env.NAMECHEAP_USERNAME;
  const isSandbox = process.env.NAMECHEAP_SANDBOX === "true";

  // Get the appropriate API URL based on the environment
  const apiUrl = isSandbox ? SANDBOX_API_URL : PRODUCTION_API_URL;

  // ---- Runtime credential validation ----------------------------------------
  const missingVars = [
    !apiUser && "NAMECHEAP_USERNAME",
    !apiKey && "NAMECHEAP_API_KEY",
    !clientIp && "NAMECHEAP_CLIENT_IP",
  ].filter(Boolean) as string[];

  if (missingVars.length) {
    throw new Error(
      `Namecheap configuration error – missing env variable${missingVars.length > 1 ? "s" : ""}: ${missingVars.join(
        ", ",
      )}`,
    );
  }
  // ---------------------------------------------------------------------------

  try {
    // Build the request parameters
    const requestParams = {
      ApiUser: apiUser,
      ApiKey: apiKey,
      UserName: userName,
      ClientIp: clientIp,
      Command: command,
      ...params,
    };

    // Make the API request
    const response = await axios.get(apiUrl, { params: requestParams });

    // Parse the XML response
    const parsedResponse = await parseStringPromise(response.data);

    // Check if the API call was successful
    // @ts-ignore
    const apiResponse = parsedResponse.ApiResponse;
    if (apiResponse.$.Status === "ERROR") {
      const errors = apiResponse.Errors[0].Error.map((error: any) => ({
        number: error.$.Number,
        message: error._,
      }));
      throw new Error(`Namecheap API Error: ${JSON.stringify(errors)}`);
    }

    // @ts-ignore
    return parsedResponse.ApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
  }
}

/**
 * Checks the availability of domains
 * @param domains Array of domain names to check
 * @returns The availability status of each domain
 */
export async function checkDomainAvailability(domains: string[]) {
  const domainList = domains.join(",")
  const response = await makeNamecheapApiRequest("namecheap.domains.check", {
    DomainList: domainList,
  })

  return response.CommandResponse[0].DomainCheckResult
}

/**
 * Registers a new domain
 * @param domain The domain name to register
 * @param years The number of years to register the domain for
 * @param registrantInfo The registrant contact information
 * @param techInfo The technical contact information
 * @param adminInfo The administrative contact information
 * @param auxInfo The auxiliary billing contact information
 * @param nameservers The nameservers to use for the domain
 * @param addFreeWhoisguard Whether to add free WhoisGuard
 * @param enableWhoisguard Whether to enable WhoisGuard
 * @returns The registration result
 */
export async function registerDomain(
  domain: string,
  years: number,
  registrantInfo: ContactInfo,
  techInfo?: ContactInfo,
  adminInfo?: ContactInfo,
  auxInfo?: ContactInfo,
  nameservers?: string[],
  addFreeWhoisguard = true,
  enableWhoisguard = true,
) {
  // Prepare the parameters for domain registration
  const params: Record<string, string> = {
    DomainName: domain,
    Years: years.toString(),
    AddFreeWhoisguard: addFreeWhoisguard ? "yes" : "no",
    WGEnabled: enableWhoisguard ? "yes" : "no",
  }

  // Add registrant contact information
  addContactInfoToParams(params, "Registrant", registrantInfo)

  // Add tech contact information if provided
  if (techInfo) {
    addContactInfoToParams(params, "Tech", techInfo)
  } else {
    // Use registrant info for tech if not provided
    addContactInfoToParams(params, "Tech", registrantInfo)
  }

  // Add admin contact information if provided
  if (adminInfo) {
    addContactInfoToParams(params, "Admin", adminInfo)
  } else {
    // Use registrant info for admin if not provided
    addContactInfoToParams(params, "Admin", registrantInfo)
  }

  // Add auxiliary billing contact information if provided
  if (auxInfo) {
    addContactInfoToParams(params, "AuxBilling", auxInfo)
  } else {
    // Use registrant info for auxiliary billing if not provided
    addContactInfoToParams(params, "AuxBilling", registrantInfo)
  }

  // Add nameservers if provided
  if (nameservers && nameservers.length > 0) {
    params.Nameservers = nameservers.join(",")
  }

  // Make the API request to register the domain
  const response = await makeNamecheapApiRequest("namecheap.domains.create", params)

  return response.CommandResponse[0].DomainCreateResult[0]
}

/**
 * Helper function to add contact information to the parameters
 * @param params The parameters object to add to
 * @param prefix The prefix for the contact type (Registrant, Tech, Admin, AuxBilling)
 * @param contactInfo The contact information
 */
function addContactInfoToParams(params: Record<string, string>, prefix: string, contactInfo: ContactInfo) {
  params[`${prefix}FirstName`] = contactInfo.firstName
  params[`${prefix}LastName`] = contactInfo.lastName
  params[`${prefix}Address1`] = contactInfo.address1
  if (contactInfo.address2) {
    params[`${prefix}Address2`] = contactInfo.address2
  }
  params[`${prefix}City`] = contactInfo.city
  params[`${prefix}StateProvince`] = contactInfo.stateProvince
  params[`${prefix}PostalCode`] = contactInfo.postalCode
  params[`${prefix}Country`] = contactInfo.country
  params[`${prefix}Phone`] = contactInfo.phone
  params[`${prefix}EmailAddress`] = contactInfo.emailAddress
  if (contactInfo.organizationName) {
    params[`${prefix}OrganizationName`] = contactInfo.organizationName
  }
  if (contactInfo.jobTitle) {
    params[`${prefix}JobTitle`] = contactInfo.jobTitle
  }
}

/**
 * Interface for contact information
 */
export interface ContactInfo {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  phone: string
  emailAddress: string
  organizationName?: string
  jobTitle?: string
}





/**
 * Transfers a domain from another registrar to Namecheap
 * @param domain The domain name to transfer
 * @param epp The EPP/Auth code for the domain
 * @param years The number of years to renew the domain for during transfer
 * @param registrantInfo The registrant contact information
 * @param techInfo The technical contact information
 * @param adminInfo The administrative contact information
 * @param auxInfo The auxiliary billing contact information
 * @param addFreeWhoisguard Whether to add free WhoisGuard
 * @param enableWhoisguard Whether to enable WhoisGuard
 * @returns The transfer result
 */
export async function transferDomain(
  domain: string,
  epp: string,
  years: number = 1,
  registrantInfo: ContactInfo,
  techInfo?: ContactInfo,
  adminInfo?: ContactInfo,
  auxInfo?: ContactInfo,
  addFreeWhoisguard = true,
  enableWhoisguard = true,
) {
  // Prepare the parameters for domain transfer
  const params: Record<string, string> = {
    DomainName: domain,
    EPPCode: epp,
    Years: years.toString(),
    AddFreeWhoisguard: addFreeWhoisguard ? "yes" : "no",
    WGEnabled: enableWhoisguard ? "yes" : "no",
  }

  // Add registrant contact information
  addContactInfoToParams(params, "Registrant", registrantInfo)

  // Add tech contact information if provided
  if (techInfo) {
    addContactInfoToParams(params, "Tech", techInfo)
  } else {
    // Use registrant info for tech if not provided
    addContactInfoToParams(params, "Tech", registrantInfo)
  }

  // Add admin contact information if provided
  if (adminInfo) {
    addContactInfoToParams(params, "Admin", adminInfo)
  } else {
    // Use registrant info for admin if not provided
    addContactInfoToParams(params, "Admin", registrantInfo)
  }

  // Add auxiliary billing contact information if provided
  if (auxInfo) {
    addContactInfoToParams(params, "AuxBilling", auxInfo)
  } else {
    // Use registrant info for auxiliary billing if not provided
    addContactInfoToParams(params, "AuxBilling", registrantInfo)
  }

  // Make the API request to transfer the domain
  const response = await makeNamecheapApiRequest("namecheap.domains.transfer.create", params)

  return response.CommandResponse[0].DomainTransferCreateResult[0]
}

/**
 * Gets the pricing for a product
 * @param productType The type of product (e.g., DOMAIN)
 * @param productCategory The category of the product (e.g., DOMAIN)
 * @param productName The name of the product (e.g., com)
 * @returns The pricing information
 */
export async function getPricing(productType: string, productCategory: string, productName: string) {
  const response = await makeNamecheapApiRequest("namecheap.users.getPricing", {
    ProductType: productType,
    ProductCategory: productCategory,
    ProductName: productName,
  });

  return response.CommandResponse[0].UserGetPricingResult[0];
}



/**
 * Gets the account balances
 * @returns The account balance information
 */
export async function getBalances() {
  const response = await makeNamecheapApiRequest("namecheap.users.getBalances", {});
  return response.CommandResponse[0].UserGetBalancesResult[0].$;
}
