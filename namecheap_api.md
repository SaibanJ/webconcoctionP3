# Namecheap API Documentation

The Namecheap API allows you to build web and desktop applications that integrate with your Namecheap account. It enables you to programmatically perform operations such as domain search, domain registration, SSL purchase etc., from within your application.

## Features

With Namecheap API you can:

- Sell domains, SSL certificates etc., on your website, at any price you choose
- Integrate domain registrations with billing applications such as Modernbill and Ubersmith
- Create applications to monitor domains and send alerts
- Build custom applications to manage your domains
- And more

## Namecheap Environments

We have production as well as test server environments. The test server environment is called sandbox. You are advised to signup for a free account in sandbox, enable API access and test all your API calls on the sandbox environment before pointing your application to production. To point an application to production, you need make only minor changes. In most cases, you simply need to change the service URL, APIusername and APIkey.

### Sandbox Environment

The following is the API Service URL for our sandbox environment:

\`\`\`
https://api.sandbox.namecheap.com/xml.response
\`\`\`

### Production Environment

We can't stress this enough: Please test your APIs against our sandbox environment before pointing them to production. We prefer to avoid service disruptions in production caused by untested code.

Here is the API Service URL for our production environment:

\`\`\`
https://api.namecheap.com/xml.response
\`\`\`

## Enabling API Access

There is no restriction on trying out our APIs in the sandbox environment. However, to enable API access on the production environment, you must meet our requirements. If you don’t meet any of our requirements but still wish to use our APIs in production, contact our support team and we will get back to you.

The steps to enable API access are similar for both production and sandbox environments. To enable API access, follow these steps on the appropriate environment:

1. Login to your Namecheap account.
2. Go to the Profile > Tools menu.
3. Scroll down to the Business & Dev Tools section. Click on MANAGE next to Namecheap API Access.
4. Toggle ON/OFF, read our Terms of Service, enter your account password.

After enabling API access, you will be allotted an APIKey. Your Namecheap account username will act as API username. Your access to the API is authenticated using these elements.

## Whitelisting IP

You should whitelist at least one IP before your API access will begin to work. Please keep in mind that only IPv4 addresses can be used.

The IP can be whitelisted in the following way:

1. Login to your Namecheap account.
2. Go to the Profile > Tools menu.
3. Scroll down to the Business & Dev Tools section. Click on MANAGE next to Namecheap API Access.
4. Click on Edit next to the Whitelisted IPs > Add IP > Enter the required details and proceed with Save Changes.

Whitelisted IPs are considered spam-free and safe for use.

## Making an API Call

You can easily access API by sending your parameters as a HTTP-GET request query string to the service URLs. The response is given in XML format. The HTTP-GET request URL is formed by adding query parameters and values to a service URL. The first parameter begins after a `?` symbol. Successive parameters are included by adding an `&` symbol before each parameter. The format for adding queries is `parameter=values`. The following is the syntax of an API call:

\`\`\`
https://<service url>/xml.response?ApiUser=<api_username>&ApiKey=<api_key>&UserName=<nc_username>&Command=<cmd_name>&ClientIp=<clientIPaddress>
\`\`\`

### Sample API Call

\`\`\`
https://api.sandbox.namecheap.com/xml.response?ApiUser=ncuser&ApiKey=apikey&UserName=ncuser&ClientIp=121.22.123.22&Command=namecheap.domains.check&DomainList=domain1.com,domain2.com
\`\`\`

The above call returns a response in XML format. You can parse this XML file to obtain the results and embed the data into the application you are creating. Please take a look at API Reference for all available commands and required parameters.

### Successful Call

You can find out if an API call was successful or not by checking the ApiResponse Status. The following is the syntax of a successful API call:

\`\`\`xml
<ApiResponse Status="OK">
  <Errors/>
  [#Requested data in XML format...]
</ApiResponse>
\`\`\`

### Erroneous Call

The following is the syntax of an erroneous API call:

\`\`\`xml
<ApiResponse Status="ERROR">
  <Errors>
    <Error Number="0">Error message</Error>
  </Errors>
</ApiResponse>
\`\`\`

## Resetting the API key

After logging in to your Namecheap account, go to the Profile > Tools menu. In the Business & Dev Tools section, click on MANAGE next to Namecheap API Access. Click Reset and enter your account password. If you reset the API key, be sure to update the API key on every API call.

> **CAUTION:** Any application using your existing API key will stop working immediately.

## Disabling API Access

To discontinue using Namecheap API, go to the Profile > Tools menu. Find Business & Dev Tools > API Access and toggle the ON/OFF switch.

> **CAUTION:** Any application using the API key will stop working immediately.

> **NOTE:** These methods work only for the domains registered with Namecheap that are currently present in your Namecheap account.

## API Commands

### domains

- **getList** — Returns a list of domains for the particular user.
- **getContacts** — Gets contact information of the requested domain.
- **create** — Registers a new domain name.
- **getTldList** — Returns a list of tlds
- **setContacts** — Sets contact information for the domain.
- **check** — Checks the availability of domains.
- **reactivate** — Reactivates an expired domain.
- **renew** — Renews an expiring domain.
- **getRegistrarLock** — Gets the RegistrarLock status of the requested domain.
- **setRegistrarLock** — Sets the RegistrarLock status for a domain.
- **getInfo** — Returns information about the requested domain.

### domains.dns

- **setDefault** — Sets domain to use our default DNS servers. Required for free services like Host record management, URL forwarding, email forwarding, dynamic dns and other value added services.
- **setCustom** — Sets domain to use custom DNS servers. NOTE: Services like URL forwarding, Email forwarding, Dynamic DNS will not work for domains using custom nameservers.
- **getList** — Gets a list of DNS servers associated with the requested domain.
- **getHosts** — Retrieves DNS host record settings for the requested domain.
- **getEmailForwarding** — Gets email forwarding settings for the requested domain
- **setEmailForwarding** — Sets email forwarding for a domain name.
- **setHosts** — Sets DNS host records settings for the requested domain.

### domains.ns

- **create** — Creates a new nameserver.
- **delete** — Deletes a nameserver associated with the requested domain.
- **getInfo** — Retrieves information about a registered nameserver.
- **update** — Updates the IP address of a registered nameserver.

### domains.transfer

- **create** — Transfers a domain to Namecheap. You can only transfer .biz, .ca, .cc, .co, .co.uk, .com, .com.es, .com.pe, .es, .in, .info, .me, .me.uk, .mobi, .net, .net.pe, .nom.es, .org, .org.es, .org.pe, .org.uk, .pe, .tv, .us domains through API at this time.
- **getStatus** — Gets the status of a particular transfer.
- **updateStatus** — Updates the status of a particular transfer. Allows you to re-submit the transfer after releasing the registry lock.
- **getList** — Gets the list of domain transfers.

### ssl

- **create** — Creates a new SSL certificate.
- **getList** — Returns a list of SSL certificates for the particular user.
- **parseCSR** — Parsers the CSR
- **getApproverEmailList** — Gets approver email list for the requested certificate.
- **activate** — Activates a newly purchased SSL certificate.
- **resendApproverEmail** — Resends the approver email.
- **getInfo** — Retrieves information about the requested SSL certificate
- **renew** — Renews an SSL certificate.
- **reissue** — Reissues an SSL certificate.
- **resendfulfillmentemail** — Resends the fulfilment email containing the certificate.
- **purchasemoresans** — Purchases more add-on domains for already purchased certificate.
- **revokecertificate** — Revokes a re-issued SSL certificate.
- **editDCVMethod** — Sets new domain control validation (DCV) method for a certificate or serves as 'retry' mechanism

### users

- **getPricing** — Returns pricing information for a requested product type.
- **getBalances** — Gets information about fund in the user's account. This method returns the following information: Available Balance, Account Balance, Earned Amount, Withdrawable Amount and Funds Required for AutoRenew.
- **changePassword** — Changes password of the particular user's account.
- **update** — Updates user account information for the particular user.
- **createaddfundsrequest** — Creates a request to add funds through a credit card
- **getAddFundsStatus** — Gets the status of add funds request.
- **create** — Creates a new account at NameCheap under this ApiUser.
- **login** — Validates the username and password of user accounts you have created using the API command namecheap.users.create.
- **resetPassword** — When you call this API, a link to reset password will be emailed to the end user's profile email id. The end user needs to click on the link to reset password.

### users.address

- **create** — Creates a new address for the user
- **delete** — Deletes the particular address for the user.
- **getInfo** — Gets information for the requested addressID.
- **getList** — Gets a list of addressIDs and addressnames associated with the user account.
- **setDefault** — Sets default address for the user.
- **update** — Updates the particular address of the user

### domainprivacy

- **changeemailaddress** — Changes domain privacy email address
- **enable** — Enables domain privacy protection.
- **disable** — Disables domain privacy protection.
- **getList** — Gets the list of domain privacy protection.
- **renew** — Renews domain privacy protection.

## Namecheap API Global Parameters

For each API call, a set of parameters are required. These parameters include information like APIUser, APIKey, etc., and should be present in all the requests.

### Global Request Parameters

| Name | Type | MaxLength | Required? | Description |
|------|------|-----------|-----------|-------------|
| ApiUser | String | 20 | Yes | Username required to access the API |
| ApiKey | String | 50 | Yes | Password required used to access the API |
| Command | String | 80 | Yes | Command for execution |
| UserName | String | 20 | Yes | The Username on which a command is executed. Generally, the values of ApiUser and UserName parameters are the same. |
| ClientIp | String | 15 | Yes | An IP address of the server from which our system receives API calls (only IPv4 can be used). |

### Global Error Codes

| Number | Description |
|--------|-------------|
| 1010101 | Parameter APIUser is missing |
| 1030408 | Unsupported authentication type |
| 1010104 | Parameter Command is missing |
| 1010102, 1011102 | Parameter APIKey is missing |
| 1010105, 1011105 | Parameter ClientIP is missing |
| 1050900 | Unknown error when validating APIUser |
| 1011150 | Parameter RequestIP is invalid |
| 1017150 | Parameter RequestIP is disabled or locked |
| 1017105 | Parameter ClientIP is disabled or locked |
| 1017101 | Parameter ApiUser is disabled or locked |
| 1017410 | Too many declined payments |
| 1017411 | Too many login attempts |
| 1019103 | Parameter UserName is not available |
| 1016103 | Parameter UserName is unauthorized |
| 1017103 | Parameter UserName is disabled or locked |
## Extended Attributes

### .US Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| RegistrantNexus | C11, C12, C21, C31, C32 | Yes | refer to notes below |
| RegistrantNexusCountry | | No | Two-digit country code |
| RegistrantPurpose | P1, P2, P3, P4, P5 | Yes | refer to notes below |

#### RegistrantNexus

- **C11** represents a natural person who is a US citizen
- **C12** represents a natural person who is a permanent resident
- **C21** represents an entity or an organization
- **C31** represents a foreign organization
- **C32** represents a foreign organization that has an office in US

#### RegistrantPurpose

- **P1** represents a business organization
- **P2** represents a non-profit or religious organization or association
- **P3** represents personal purpose
- **P4** represents educational purpose
- **P5** represents government purpose organization, etc.

### .EU Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| EUAgreeWhoisPolicy | YES | Yes | refer to .EU Policy below |
| EUAgreeDeletePolicy | YES, NO | Yes | refer to .EU deletion rules below |
| EUAdrLang | BG, CS, DS, NL, EN, EL, PT ET, FI, FR, DE, HU, IT, LV, LI, MT, PL, RO, SK, SL, ES, SV | No | refer to note below |

#### .EU Policy

I hereby agree that the Registry is entitled to transfer the data contained in this application to third parties (i) if ordered to do so by a public authority, carrying out its legitimate tasks; and (ii) upon demand of an ADR Provider as mentioned in section 16 of the .EU Terms and Conditions and (iii) as provided in Section 2 (WHOIS look-up facility) of the .EU Domain Name WHOIS Policy.

#### .EU Deletion Rules

I agree and acknowledge to the special renewal and expiration terms set forth below for this domain name, including those terms set forth in the Registration Agreement. I understand that unless I have set this domain for autorenewal, this domain name must be explicitly renewed by the expiration date or the 20th of the month of expiration, whichever is sooner. (e.g. If the name expires on Sept 4th, 2008, then a manual renewal must be received by Sept 4th, 2008. If name expires on Sep 27th, 2008, the renewal request must be received prior to Sep 20th, 2008). If the name is not manually renewed or previously set to autorenew, a delete request will be issued by Namecheap. When a delete request is issued, the name will remain fully functional in my account until expiration, but will no longer be renewable nor will I be able to make any modifications to the name. These terms are subject to change.

#### EUAdrLang

- **BG** stands for Bulgaria
- **CS** stands for Czech
- **DS** stands for Danish
- **NL** stands for Dutch
- **EN** stands for English
- **ET** stands for Estonian
- **FI** stands for Finnish
- **FR** stands for French
- **DE** stands for German
- **EL** stands for Greek
- **HU** stands for Hungarian
- **IT** stands for Italian
- **LV** stands for Latvian
- **LI** stands for Lithuanian
- **MT** stands for Maltese
- **PL** stands for Polish
- **RO** stands for Romania
- **SK** stands for Slovak
- **SL** stands for Slovenian
- **ES** stands for Spanish
- **SV** stands for Swedish

### .NU Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| NUOrgNo | | Yes | Personal Identification Number |
| NUvatNo | | No | Swedish Organization in addition to Corporation ID, user can also optionally provide additional Tax/VAT Number. |

For NUOrgNo parameter, the Swedish Resident, should provide a valid:

- Personal Identification Number, if registrant is an individual
- Organization Identification Number, if the registrant is a corporation registered in Sweden.

### .CA Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| CIRALegalType | CCO, CCT, RES, GOV, EDU, ASS, HOP, PRT, TDM, TRD, PLT, LAM, TRS, ABO, INB, LGR, OMK, MAJ | Yes | Legal Type of Registrant Contact |
| CIRAWhoisDisplay | Full, Private | Yes | Individuals (CCT, RES, ABO, LGR) may keep their Registrant contact information private in CIRA's Whois; non-individuals must show their full Registrant information. |
| CIRAAgreementVersion | 2.0 | Yes | Version of the CIRA Registrant Agreement to which Registrant is agreeing. |
| CIRAAgreementValue | Y | Yes | This value should be Y (agreed to agreement) for the domain to be registered. Passing other values will fail the registration. |
| CIRALanguage | en, fr | No | Language in which to communicate with the contact. Default: en |

#### CIRALegalType

- **CCO** represents a Corporation
- **CCT** represents a Canadian citizen
- **RES** represents a Canadian resident
- **GOV** represents a Government entity
- **EDU** represents an Educational
- **ASS** represents a Unincorporated Association
- **HOP** represents a Hospital
- **PRT** represents a Partnership
- **TDM** represents a Trade-mark
- **TRD** represents a Trade Union
- **PLT** represents a Political Party
- **LAM** represents Libraries, Archives and Museums
- **TRS** represents a Trust
- **ABO** represents Aboriginal Peoples
- **INB** represents Indian Band
- **LGR** represents Legal Representative
- **OMK** represents an Official Mark
- **MAJ** represents The Queen

### .CO.UK Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| COUKLegalType | IND, FIND, LTD*, PLC*, PTNR, LLP*, IP, STRA, SCH, FOTHER, RCHAR*, GOV, OTHER, CRC, FCORP, STAT, FOTHER | Yes | Legal Type of Registrant Contact |
| COUKCompanyID | | No | Company Identification Number |
| COUKRegisteredfor | | Yes | Company or Person the domain is registered for |

#### COUKLegalType

- **IND** represents a UK individual
- **FIND** represents a Non-UK individual
- **LTD** represents a UK Limited Company*
- **PLC** represents a UK Public Limited Company*
- **PTNR** represents UK Partnership
- **LLP** represents UK Limited Liability Partnership*
- **IP** represents UK Industrial/Provident Registered Company
- **STRA** represents UK Sole Trader
- **SCH** represents UK School
- **RCHAR** represents UK Registered Charity*
- **GOV** represents UK Government Body
- **OTHER** represents UK Entity (other)
- **CRC** represents UK Corporation by Royal Charter
- **FCORP** represents Foreign Organization
- **STAT** represents UK Statutory Body
- **FOTHER** represents Other Foreign Organizations

For values marked with * symbol, the COUKCompanyID parameter (company identification number) is required.

### .ME.UK Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| MEUKLegalType | IND, FIND, LTD*, PLC*, PTNR, LLP*, IP, STRA, SCH, FOTHER, RCHAR*, GOV, OTHER, CRC, FCORP, STAT, FOTHER | Yes | Legal Type of Registrant Contact |
| MEUKCompanyID | | No | Company Identification Number |
| MEUKRegisteredfor | | Yes | Company or Person the domain is registered for |

#### MEUKLegalType

- **IND** represents a UK individual
- **FIND** represents a Non-UK individual
- **LTD** represents a UK Limited Company*
- **PLC** represents a UK Public Limited Company*
- **PTNR** represents UK Partnership
- **LLP** represents UK Limited Liability Partnership*
- **IP** represents UK Industrial/Provident Registered Company
- **STRA** represents UK Sole Trader
- **SCH** represents UK School
- **RCHAR** represents UK Registered Charity*
- **GOV** represents UK Government Body
- **OTHER** represents UK Entity (other)
- **CRC** represents UK Corporation by Royal Charter
- **FCORP** represents Foreign Organization
- **STAT** represents UK Statutory Body
- **FOTHER** represents Other Foreign Organizations

For values marked with * symbol, the MEUKCompanyID parameter (company identification number) is required.

### .ORG.UK Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| ORGUKLegalType | IND, FIND, LTD*, PLC*, PTNR, LLP*, IP, STRA, SCH, FOTHER, RCHAR*, GOV, OTHER, CRC, FCORP, STAT, FOTHER | Yes | Legal Type of Registrant Contact |
| ORGUKCompanyID | | No | Company Identification Number |
| ORGUKRegisteredfor | | Yes | Company or Person the domain is registered for |

#### ORGUKLegalType

- **IND** represents a UK individual
- **FIND** represents a Non-UK individual
- **LTD** represents a UK Limited Company*
- **PLC** represents a UK Public Limited Company*
- **PTNR** represents UK Partnership
- **LLP** represents UK Limited Liability Partnership*
- **IP** represents UK Industrial/Provident Registered Company
- **STRA** represents UK Sole Trader
- **SCH** represents UK School
- **RCHAR** represents UK Registered Charity*
- **GOV** represents UK Government Body
- **OTHER** represents UK Entity (other)
- **CRC** represents UK Corporation by Royal Charter
- **FCORP** represents Foreign Organization
- **STAT** represents UK Statutory Body
- **FOTHER** represents Other Foreign Organizations

For values marked with * symbol, the ORGUKCompanyID parameter (company identification number) is required.

### .COM.AU Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| COMAURegistrantId | | Yes | Id of the registrant |
| COMAURegistrantIdType | ABN, ACN, RBN, TM | Yes | The registrant type |

#### COMAURegistrantIdType

- **ABN** represents Australian Business Number
- **ACN** represents Australian Company Number
- **RBN** represents Business Registration Number
- **TM** represents a Trademark Number

### .NET.AU Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| NETAURegistrantId | | Yes | Id of the registrant |
| NETAURegistrantIdType | ABN, ACN, RBN, TM | Yes | The registrant type |

#### NETAURegistrantIdType

- **ABN** represents Australian Business Number
- **ACN** represents Australian Company Number
- **RBN** represents Business Registration Number
- **TM** represents a Trademark Number

### .ORG.AU Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| ORGAURegistrantId | | Yes | Id of the registrant |
| ORGAURegistrantIdType | ABN, ACN, RBN, TM | Yes | The registrant type |

#### ORGAURegistrantIdType

- **ABN** represents Australian Business Number
- **ACN** represents Australian Company Number
- **RBN** represents Business Registration Number
- **TM** represents a Trademark Number

### .ES Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| ESRegistrantId | | Yes | Id of the registrant |
| ESRegistrantIdType | ALIENID, GENERICID, VATID | Yes | The registrant type |
| ESLegalFormType | Association, CentralGovernmentBody, CivilSociety, CommunityofOwners, CommunityProperty, Consulate, Cooperative, DesignationofOriginSupervisoryCouncil, EconomicInterestGroup, Embassy, EntityManagingNaturalAreas, FarmPartnership, Foundation, GeneralandLimitedPartnership, GeneralPartnership, Individual, LimitedCompany, LocalAuthority, LocalPublicEntity, MutualInsuranceCompany, NationalPublicEntity, OrderorReligiousInstitution, Others, PoliticalParty, ProfessionalAssociation, PublicLawAssociation, PublicLimitedCompany, RegionalGovernmentBody, RegionalPublicEntity, SavingsBank, SpanishOffice, SportsAssociation, Sports_Association, SportsFederation, TemporaryAllianceofEnterprises, TradeUnion, WorkerownedCompany, WorkerownedLimitedCompany | Yes | The legal form type |
| ESAdminIdType | GENERICID, NATIONALIDENTITY, ALIENID | Yes | Admin ID type |
| EsAdminID | | Yes | ID of the Admin |
| ESAcceptAgreement | Yes, No | Yes | To agree the terms for the domain name |

### .NOM.ES Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| NOMESRegistrantId | | Yes | Id of the registrant |
| NOMESRegistrantIdType | ALIENID, GENERICID, VATID | Yes | The registrant type |
| NOMESLegalFormType | Association, CentralGovernmentBody, CivilSociety, CommunityofOwners, CommunityProperty, Consulate, Cooperative, DesignationofOriginSupervisoryCouncil, EconomicInterestGroup, Embassy, EntityManagingNaturalAreas, FarmPartnership, Foundation, GeneralandLimitedPartnership, GeneralPartnership, Individual, LimitedCompany, LocalAuthority, LocalPublicEntity, MutualInsuranceCompany, NationalPublicEntity, OrderorReligiousInstitution, Others, PoliticalParty, ProfessionalAssociation, PublicLawAssociation, PublicLimitedCompany, RegionalGovernmentBody, RegionalPublicEntity, SavingsBank, SpanishOffice, SportsAssociation, Sports_Association, SportsFederation, TemporaryAllianceofEnterprises, TradeUnion, WorkerownedCompany, WorkerownedLimitedCompany | Yes | The legal form type |

### .COM.ES Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| COMESRegistrantId | | Yes | Id of the registrant |
| COMESRegistrantIdType | ALIENID, GENERICID, VATID | Yes | The registrant type |
| COMESLegalFormType | Association, CentralGovernmentBody, CivilSociety, CommunityofOwners, CommunityProperty, Consulate, Cooperative, DesignationofOriginSupervisoryCouncil, EconomicInterestGroup, Embassy, EntityManagingNaturalAreas, FarmPartnership, Foundation, GeneralandLimitedPartnership, GeneralPartnership, Individual, LimitedCompany, LocalAuthority, LocalPublicEntity, MutualInsuranceCompany, NationalPublicEntity, OrderorReligiousInstitution, Others, PoliticalParty, ProfessionalAssociation, PublicLawAssociation, PublicLimitedCompany, RegionalGovernmentBody, RegionalPublicEntity, SavingsBank, SpanishOffice, SportsAssociation, Sports_Association, SportsFederation, TemporaryAllianceofEnterprises, TradeUnion, WorkerownedCompany, WorkerownedLimitedCompany | Yes | The legal form type |

### .ORG.ES Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| ORGESRegistrantId | | Yes | Id of the registrant |
| ORGESRegistrantIdType | ALIENID, GENERICID, VATID | Yes | The registrant type |
| ORGESLegalFormType | Association, CentralGovernmentBody, CivilSociety, CommunityofOwners, CommunityProperty, Consulate, Cooperative, DesignationofOriginSupervisoryCouncil, EconomicInterestGroup, Embassy, EntityManagingNaturalAreas, FarmPartnership, Foundation, GeneralandLimitedPartnership, GeneralPartnership, Individual, LimitedCompany, LocalAuthority, LocalPublicEntity, MutualInsuranceCompany, NationalPublicEntity, OrderorReligiousInstitution, Others, PoliticalParty, ProfessionalAssociation, PublicLawAssociation, PublicLimitedCompany, RegionalGovernmentBody, RegionalPublicEntity, SavingsBank, SpanishOffice, SportsAssociation, Sports_Association, SportsFederation, TemporaryAllianceofEnterprises, TradeUnion, WorkerownedCompany, WorkerownedLimitedCompany | Yes | The legal form type |

### .DE Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| DEConfirmAddress | DE | Yes | To confirm the Administrative address is a valid German address |
| DEAgreeDelete | Yes, No | Yes | To agree the renewal terms for the domain name |

### .FR Domains

| Parameter | Possible Values | Required? | Description |
|-----------|----------------|-----------|-------------|
| FRRegistrantBirthDate | | Yes | Required only when FRLegalType=Individual |
| FRRegistrantBirthplace | | Yes | Required only when FRLegalType=Individual |
| FRRegistrantLegalId | | Yes | Required only when FRLegalType=Company. French company with a SIREN or SIRET number should continue to provide this number instead as legal id. The SIREN number is the first part of the SIRET NUMBER and consists of 9 digits. The SIRET number is a unique identification number with 14 digits. |
| FRRegistrantTradeNumber | | Yes | Required only when FRLegalType=Company. Companies with a European trademark: For companies with a European trademark can additionally add their trademark number using this extension. |
| FRRegistrantDunsNumber | | Yes | Required only when FRLegalType=Company. The DUNS number is a nine-digit number, issued by Dun Bradstreet. DUNS is the abbreviation of Data Universal Numbering System. Companies with a valid DUNS number are still obliged having their head office in the territory of the European Union. The DUNS number can be provided using this extension. |
| FRRegistrantLocalId | | Yes | Required only when FRLegalType=Company. Companies with a local identifier specific to a country of the European Economic Area can provide their local identifier using this extension. |
| FRRegistrantJoDateDec | | Yes | Required only when FRLegalType=Company. French associations listed with the Journal Officiel de la République Francaise - The official gazette of the French Republic: The Journal Official Associations publishes notices of creations, breakup or substantial changes with nonprofit associations in France. Using the website http://www.societe.com and the database they provide, query for the respective data below to register a .FR domain name. - The date of declaration of the association in the form YYYY-MM-DD. |
| FRRegistrantJoDatePub | | Yes | Required only when FRLegalType=Company. The date of publication in the Journal Official in the form YYYY-MM-DD |
| FRRegistrantJoNumber | | Yes | Required only when FRLegalType=Company. The number of the Journal Official |
| FRRegistrantJoPage | | Yes | Required only when FRLegalType=Company. The page of the announcement in the Journal Official |
| FRLegalType | Company, Individual | Yes | Registrant type |

## Transfer Statuses and Description

Possible transfer statuses: `WAITINGFOREPP`, `CANCELED`, `COMPLETED`

### Status ID and Description from Provider

| StatusID | Description |
|----------|-------------|
| 0 | Transfer request created - awaiting fax |
| 1 | WhoIs information matches |
| 2 | Canceled due to WhoIs error |
| 3 | Pending due to domain status |
| 4 | Canceled due to domain status |
| 5 | Transferred and paid successfully |
| 6 | Transfer incomplete - charge problem |
| 7 | Frozen due to charge problem |
| 8 | NSI rejected transfer |
| 9 | Awaiting auto verification of transfer request |
| 10 | Transfer in Process - Acquiring Current Whois for Transfer Verification |
| 11 | Auto verification of transfer request initiated |
| 12 | Awaiting for auto transfer string validation |
| 13 | Domain awaiting transfer initiation |
| 14 | Domain transfer initiated and awaiting approval |
| 15 | Canceled - cannot obtain domain contacts from Whois |
| 16 | Canceled - domain contacts did not respond to verification e-mail |
| 17 | Canceled - domain contacts did not approve transfer of domain |
| 18 | Canceled - domain validation string is invalid |
| 19 | Canceled - Whois information provided does not match current registrant |
| 20 | Canceled - Domain is currently not registered and cannot be transferred |
| 21 | Canceled - Domain is already registered in account and cannot be transferred |
| 22 | Canceled - Domain is locked at current registrar, or is not yet 60 days old |
| 23 | Canceled - Transfer already initiated for this domain |
| 24 | Canceled - Unable to transfer due to unknown error |
| 25 | Canceled - The current registrar has rejected transfer (please contact them for details) |
| 26 | Canceled - Transfer authorization fax not received |
| 27 | Canceled by customer |
| 28 | Fax received - awaiting registrant verification |
| 29 | Awaiting manual fax verification |
| 30 | Canceled - Domain name is invalid or is Invalid for Transfers |
| 31 | Canceled - Domain is currently undergoing transfer by another Registrar |
| 32 | Canceled - Invalid EPP/authorization key - Please contact current registrar to obtain correct key |
| 33 | Canceled - Cannot transfer domain from name-only account |
| 34 | Unable to complete transfer. Transfers must include a change in registrar |
| 35 | Transfer request not yet submitted |
| 36 | Canceled - Account is not authorized to perform domain transfers |
| 37 | Canceled - Domain was not retagged or not retagged in time by losing registrar |
| 45 | Order canceled |
| 48 | Canceled - registrant to registrant transfer only allowed into Retail accounts |
| 49 | Canceled - Maximum registration period exceeded |
| 50 | Canceled - Cannot transfer premium name |
| 51 | Canceled - Registrant info is missing |

### Status ID and Description from Namecheap

| StatusID | Description |
|----------|-------------|
| -4 | Canceled - Domain is locked at current registrar, or is not yet 60 days old |
| -22 | Canceled - Invalid entry |
| -1 | EPP Provided. Queued for Transfer |
| -5 | Authorization mail will be sent shortly |
| -2 | Resubmitted - Queued for transfer |
| -1 | Queued for submission or Queued for Transfer or EPP Provided |
| -202 | Unable to retrieve expiration date from Whois database |
| -22 | Waiting for EPP Transfer Code from Customer |

## Authentication Error Codes

Common for all commands

| Number | Description |
|--------|-------------|
| 1010101 | Parameter APIUser is missing |
| 1030408 | Unsupported authentication type |
| 1010104 | Parameter Command is missing |
| 1010102, 1011102 | Parameter APIKey is missing |
| 1010105, 1011105 | Parameter ClientIP is missing |
| 1050900 | Unknown error when validating APIUser |
| 1011150 | Parameter RequestIP is invalid |
| 1017150 | Parameter RequestIP is disabled or locked |
| 1017105 | Parameter ClientIP is disabled or locked |
| 1017101 | Parameter ApiUser is disabled or locked |
| 1017410 | Too many declined payments |
| 1017411 | Too many login attempts |
| 1019103 | Parameter UserName is not available |
| 1016103 | Parameter UserName is unauthorized |
| 1017103 | Parameter UserName is disabled or locked |
### namecheap.domains.getList

| Number | Description |
|--------|-------------|
| 5019169 | Unknown exceptions while retrieving Domain list |

### namecheap.domains.getContacts

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associate with your account |
| 4019337 | Unable to retrieve domain contacts |
| 3016166 | Domain is not associate with Enom |
| 3019510 | This domain has either expired/ was transferred out/ is not associated with your account |
| 3019510 | Error response from provider |
| 3050900 | Unknown response from provider |
| 5050900 | Unknown exceptions |
### namecheap.domains.create

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. The order chargeable for Username is not found |
| 2033407, 2033270 | Cannot enable domain privacy when AddWhoisguard is set as NO |
| 2015267 | EUAgreeDelete option should not be set as NO |
| 2011170 | Validation error from PromotionCode |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
| 2011280 | Validation error from TLD |
| 2015167 | Validation error from Years |
| 2030280 | TLD is not supported in API |
| 2011168 | Nameservers are not valid |
| 2011322 | Extended Attributes are not Valid |
| 2010323 | Check required field for billing domain contacts |
| 2528166 | Order creation failed |
| 3019166, 4019166 | Domain not available |
| 3031166 | Error while getting information from provider |
| 3028166 | Error from Enom ( Errcount <> 0 ) |
| 3031900 | Unknown Response from provider |
| 4023271 | Error while adding free positive ssl for the domain |
| 3031166 | Error while getting Domain status from Enom |
| 4023166 | Error while adding domain |
| 5050900 | Unknown error while adding domain to your account |
| 4026312 | Error in refunding funds |
| 5026900 | Unknown exceptions error while refunding funds |
### namecheap.domains.getTldList

| Number | Description |
|--------|-------------|
| 2011166 | UserName is invalid |
| 3050900 | Unknown response from provider |

### namecheap.domains.setContacts

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2030166 | Edit permission for domain is not supported |
| 2010324 | Registrant contacts such as firstname, lastname etc are missing |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
| 2010325 | Tech contacts such as firstname, lastname etc are missing |
| 2010326 | Admin contacts such as firstname, lastname etc are missing |
| 2010327 | AuxBilling contacts such as firstname, lastname etc are missing |
| 2016166 | Domain is not associated with your account |
| 2011280 | Cannot see the contact information for your TLD |
| 4022323 | Error from retrieving domain Contacts |
| 2011323 | Error retrieving domain Contacts from Enom (Invalid errors) |
| 3031510 | Error From Enom when error count <>0 |
| 3050900 | Unknown error from Enom |
### namecheap.domains.check

| Number | Description |
|--------|-------------|
| 3031510 | Error response from Enom when the error count != 0 |
| 3011511 | Unknown response from Provider |

### namecheap.domains.reactivate

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2019166 | Domain not found |
| 2030166 | Edit permission for Domain is not supported |
| 2011170 | Promotion Code is invalid |
| 2011280 | TLD is invalid |
| 2528166 | Order creation failed |
| 3024510 | Error Response from Enom while updating domain |
| 3050511 | Unknown error response from Enom |
| 2020166 | Domain does not meet the expire date |
| 2016166 | Domain is not associate with your account |
| 5050900 | Unhandled exceptions |
| 4024166 | Failed to update domain in your account |
### namecheap.domains.renew

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2011170 | Promotion Code is invalid |
| 2011280 | TLD is invalid |
| 2528166 | Order creation failed |
| 2020166 | Domain has expired. Please reactivate your domain |
| 3028166 | Failed to renew error from Enom |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 2016166 | Domain is not associated with your account |
| 4024167 | Failed to update years for your domain |
| 4023166 | Error occurred while domain renewal |
| 4022337 | Error in refunding funds |
### namecheap.domains.getRegistrarLock

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associate with your account |
| 3031510 | Error response from provider when errorcount !=0 |
| 3050900 | Unknown error response from Enom |
| 5050900 | Unknown exceptions |

### namecheap.domains.setRegistrarLock

| Number | Description |
|--------|-------------|
| 2015278 | Invalid data specified for LockAction |
| 2019166 | Domain not found |
| 2016166 | Domain is not associate with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 2030166 | Edit permission for Domain is not supported |
| 3050900 | Unknown error response from Enom |
| 5050900 | Unknown exceptions |
### namecheap.domains.getInfo

| Number | Description |
|--------|-------------|
| 5019169 | Unknown exceptions |

### namecheap.domains.dns.setDefault

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 2030166 | Edit permission for domain is not supported |
| 3013288 | Too many records |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 4022288 | Unable to get nameserver list |
### namecheap.domains.dns.setCustom

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 2030166 | Edit permission for domain is not supported |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 4022288 | Unable to get nameserver list |

### namecheap.domains.dns.getList

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 4022288 | Unable to get nameserver list |
### namecheap.domains.dns.getHosts

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2030166 | Edit Permission for Domainname is not supported |
| 4023330 | Unable to get DNS hosts from list |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 2030288 | Cannot complete this command as this domain is not using proper DNS servers |
| 3050900 | Unknown error from Enom |
| 3011288 | Invalid nameserver specified |
| 5050900 | Unhandled Exceptions |
### namecheap.domains.dns.setHosts

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 2030166 | Edit Permission for domain is not supported |
| 3013288, 4013288 | Too many records |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 4022288 | Unable to get nameserver list |
### namecheap.domains.dns.getEmailForwarding

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2030166 | Edit Permission for domain is not supported |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 2030288 | Cannot complete this command as this domain is not using proper DNS servers |
| 4022328 | Unable to get EmailForwarding records from database |
| 3011288 | Invalid nameserver |
| 5050900 | Unhandled exceptions |
### namecheap.domains.dns.setEmailForwarding

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 2030166 | Edit Permission for domain is not supported |
| 3013288 | Too many records |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
| 2030288 | Cannot complete this command as this domain is not using proper DNS servers |
| 4022288 | Unable to get nameserver list |
### domains.ns.create

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |

### domains.ns.update

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
### domains.ns.delete

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |

### domains.ns.getInfo

| Number | Description |
|--------|-------------|
| 2019166 | Domain not found |
| 2016166 | Domain is not associated with your account |
| 3031510 | Error From Enom when Errorcount <> 0 |
| 3050900 | Unknown error from Enom |
### domains.transfer.create

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2011170 | Validation error from promotion code |
| 2011280 | TLD is not valid |
| 2030280 | TLD is not supported for API |
| 2528166 | Order creation failed |
| 5050900 | Unhandled exceptions |
### domains.transfer.updateStatus

| Number | Description |
|--------|-------------|
| 4019329 | TransferStatus not available |
| 2010293 | No Action Specified |
| 5050900 | Unhandled exceptions |

### domains.transfer.getList

| Number | Description |
|--------|-------------|
| 4019329 | TransferStatus not available |
| 2010293 | No Action Specified |
| 5050900 | Unhandled exceptions |

### domains.transfer.getStatus

| Number | Description |
|--------|-------------|
| 4019329 | TransferStatus not available |
| 5050900 | Unhandled exceptions |
### namecheap.users.changePassword

| Number | Description |
|--------|-------------|
| 2015103 | Cannot change UserName and ResetCode at a time |
| 2010302 | OldPassword is missing |
| 2010103 | UserName is missing |
| 2010303 | ResetCode is missing |
| 4011331 | Invalid status |
| 4022335 | Unable to change password |
| 5050900 | Unhandled exceptions |
### namecheap.users.login

| Number | Description |
|--------|-------------|
| 2011335 | Parameter Password is missing |
| 2019166 | UserName is not available |
| 2010335 | Invalid password |
| 2017166 | User is disabled or locked |
| 2013410 | Too many declined payments |
| 2017289 | Parameter IP Blocked |
| 2011166 | UserName is invalid |
| 5050900 | Unhandled exceptions |
### namecheap.users.getAddFundsStatus

| Number | Description |
|--------|-------------|
| 2012342 | TokenID mismatch |
| 5050900 | Unknown Exceptions |
### namecheap.users.createAddfundsRequest

| Number | Description |
|--------|-------------|
| 2030343 | Parameter PaymentType is unsupported |
| 2019103 | Username not found |
| 2015312 | Minimum amount should be added |
| 2013312 | Amount is out of range |
| 2029341 | Credit card not approved |
| 5050900 | Unknown Exceptions |
### namecheap.users.getBalances

| Number | Description |
|--------|-------------|
| 4022312 | Balance information is not available |
### namecheap.users.getPricing

| Number | Description |
|--------|-------------|
| 2011170 | PromotionCode is invalid |
| 2011298 | ProductType is invalid |
### namecheap.users.resetPassword

| Number | Description |
|--------|-------------|
| 2011315 | FindBy is invalid |
| 4027153 | Failed to send email |
| 4022335 | Unable to reset password |
| 5050900 | Unhandled exceptions |
### namecheap.users.update

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for update is invalid |
| 4024103 | Failed to update user |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
### namecheap.users.address.create

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for create is invalid |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
| 4023336 | Failed to add user's address |
### namecheap.users.address.delete

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for delete is invalid |
| 4023336 | Failed to delete user's address |
### namecheap.users.address.getInfo

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for getInfo is invalid |
| 4022336 | Failed to retrieve user's address |
### namecheap.users.address.getList

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for update is invalid |
### namecheap.users.address.update

| Number | Description |
|--------|-------------|
| 4011331 | StatusCode for update is invalid |
| 4024336 | Failed to update user's address |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
### namecheap.users.address.setDefault

| Number | Description |
|--------|-------------|
| 4023336 | Failed to get set default user's address |
### namecheap.ssl.activate

| Number | Description |
|--------|-------------|
| 2010326 | Error while validating administrative address |
| 2011294, 4011294 | CertificateID is invalid |
| 2019331 | Certificate status is not available |
| 4020294 | Activation period for this certificate is over |
| 4011331 | Certificate status is invalid |
| 4011297, 2011297 | WebServerType is invalid |
| 3011166 | Invalid renewal order domain |
| 3011296 | The CSR provided is invalid |
| 4024295 | Unable to update ApproverEmail in database |
| 4024331 | Unable to update status in database |
| 3028301 | Failed to purchase certificate |
| 3011295 | ApproverEmail is not valid |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
| 2011300 | Validation for True Business with EV |
| 2030332 | Config file value does not support for activation |
| 2010297 | WebServerType is missing |
| 4011296 | CSR invalid error from Provider |
| 4024294 | Failed to update CertificateID |
| 4027295 | Failed to send ApproverEmail |
| 2011510 | Partner name is invalid |
| 5050900 | Unhandled exceptions |
| 2011333 | xmlfile is missing error while getting xml form from filepath and xmlstring from config file |
| 4050900 | Unhandled exception from database error |
### namecheap.ssl.create

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2015167 | Number of years should be maximum 10 |
| 2011301 | SSLType is invalid |
| 2011170 | Promotion code is invalid |
| 4011299 | The Purchasevalidationid already exists.The certificate cannot be created |
| 2528166 | Order creation failed |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.reissue

| Number | Description |
|--------|-------------|
| 2010326 | Error while validating administrative address |
| 2011294, 4011294 | CertificateID is invalid |
| 2019331 | Certificate status is not available |
| 4011331 | Certificate status is invalid |
| 4011297, 2011297 | WebServerType is invalid |
| 3011166 | Invalid renewal order domain |
| 3011296 | The CSR provided is invalid |
| 4024295 | Unable to update ApproverEmail in database |
| 4024331 | Unable to update status in database |
| 3028301 | Failed to purchase certificate |
| 3011295 | ApproverEmail is not valid |
| 2015182 | The contact phone is invalid. The phone number format is +NNN.NNNNNNNNNN |
| 2011300 | Validation for True Business with EV |
| 2030332 | Config file value does not support for activation |
| 2010297 | WebServerType is missing |
| 4011296 | CSR invalid error from Provider |
| 4024294 | Failed to update CertificateID |
| 4027295 | Failed to send ApproverEmail |
| 2011510 | Partner name is invalid |
| 5050900 | Unhandled exceptions |
| 2011333 | xmlfile is missing error while getting xml form from filepath and xmlstring from config file |
| 4050900 | Unhandled exception from database error |
### namecheap.ssl.getApproverEmailList

| Number | Description |
|--------|-------------|
| 2011296 | CSR is invalid |
| 2011300, 4011300 | CertificateType is invalid |
| 2011166 | DomainName is invalid |
| 3022295 | Failed to retrieve ApproverEmail |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.getInfo

| Number | Description |
|--------|-------------|
| 2011294 | CertificateID is invalid |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.parseCSR

| Number | Description |
|--------|-------------|
| 2011300 | CertificateType is invalid |
| 3022296 | Failed to retrieve CSR details from provider |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.getList

| Number | Description |
|--------|-------------|
| 2011272 | ListType is invalid |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.renew

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2015167 | Number of years should be maximum 10 |
| 2011301 | SSLType is invalid |
| 2011170 | Promotion code is invalid |
| 4011294 | CertificateID is invalid |
| 2528166 | Order creation failed |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.resendApproverEmail

| Number | Description |
|--------|-------------|
| 2011294 | CertificateID is invalid |
| 2011331 | Status is invalid |
| 3011295 | ApproverEmail is invalid |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.resendFullfillmentEmail

| Number | Description |
|--------|-------------|
| 2011294 | CertificateID is invalid |
| 2011331 | Status is invalid |
| 3022334 | Failed to resend fulfillment email |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.purchasemoresans

| Number | Description |
|--------|-------------|
| 2033409 | Possibly a logical error in authentication phase. Order chargeable for Username is not found |
| 2015167 | Number of years should be maximum 10 |
| 2011301 | SSLType is invalid |
| 2011170 | Promotion code is invalid |
| 4011299 | The Purchasevalidationid already exists.The certificate cannot be created |
| 2528166 | Order creation failed |
| 5050900 | Unhandled exceptions |
### namecheap.ssl.revokecertificate

| Number | Description |
|--------|-------------|
| 4011331 | Status is invalid |
| 2011300 | Wrong SSL certificate selection. The type provided is not supported by command |
### namecheap.whoisguard.changeEmailAdrress

| Number | Description |
|--------|-------------|
| 2011331 | Domain privacy does not exists (or) domain privacy is not associated with any domain (or) domain privacy is not associated with this user |
### namecheap.whoisguard.enable

| Number | Description |
|--------|-------------|
| 2011331 | Domain privacy does not exists (or) domain privacy is not associated with any domain (or) domain privacy is not associated with this user |
| 2011369 | Error domain privacy forwarded Email address is not valid |
### namecheap.whoisguard.disable

| Number | Description |
|--------|-------------|
| 2011331 | Domain privacy does not exists (or) domain privacy is not associated with any domain (or) domain privacy is not associated with this user |
### namecheap.whoisguard.unallot

| Number | Description |
|--------|-------------|
| 2011331 | Domain privacy is not associated with any domain. So cannot unallot the domain privacy (or) domain privacy does not exists. So cannot unallot the domain privacy (or) domain privacy is not associated with this user. So cannot unallot the domain privacy |
### namecheap.whoisguard.discard

| Number | Description |
|--------|-------------|
| 2011331 | Domain privacy is not associated with this user, domain privacy is not discarded due to associated with domain |
### namecheap.whoisguard.allot

| Number | Description |
|--------|-------------|
| 2011331 | DOMAIN PRIVACY ALREADY EXISTS FOR THIS DOMAIN (or) THIS DOMAIN PRIVACY IS ALREADY ASSOCIATED WITH ANOTHER DOMAIN (or) domain privacy is not associated with this user (or) DOMAIN PRIVACY EXPIRED OR DOMAIN PRIVACY IS NOT IN USE |
| 2011369 | Domain privacy forwarded Email address is not valid |
| 2011280 | Domain privacy cannot be alloted/enabled for this domain |

## Namecheap API Change Log

### 28-Feb-2018
- Disabled possibility of activating 3-year SSL products in namecheap.ssl.activate.
- Added warning for 3-year SSL products in namecheap.ssl.reissue.

### 26-Feb-2018
- Deprecated 3-year option for all SSL products in namecheap.ssl.create and namecheap.ssl.renew.

### 20-July-2017
- New command namecheap.ssl.editdcvmethod added.

### 10-June-2017
- Numerous parameters were deprecated, some were made not required in namecheap.ssl.activate and namecheap.ssl.reissue APIs. Introduced CNAME DCV method.

### 22-May-2014
- Additional parameters were added to namecheap.ssl.activate, namecheap.ssl.reissue, namecheap.ssl.create, namecheap.ssl.getinfo, namecheap.ssl.parsecsr commands related to multi-domain and http-based validation method.
- New commands namecheap.ssl.purchasemoresans and namecheap.ssl.revokecertificate added.

### 10-July-2012
- Additional parameters for Comodo OV certificates were added to namecheap.ssl.activate command.

### 08-Jun-2012
- UK domain registrations are now real time in namecheap.domains.create command.

### 08-May-2012
- EPP code with special characters should now be sent in base64 format in namecheap.domains.transfer.create command.

### 15-Dec-2011
- IDN domain registeration support enabled in namecheap.domains.create command.
- New command namecheap.domains.getInfo added.

### 17-Nov-2011
- Quantity parameter is removed in namecheap.ssl.create command.

### 12-Nov-2011
- Added support for OX as email type in namecheap.domains.dns.sethosts command.

### 24-Aug-2011
- The following parameters were added to namecheap.ssl.activate command: CompanyIncorporationLocality, CompanyIncorporationStateProvince, CompanyIncorporationCountry, CompanyIncorporationDate, CompanyDBA, CompanyRegistrationNumber.

### 27-May-2011
- New command namecheap.ssl.reissue added.

### 30-Apr-2011
- Added support for EssentialSSL, EssentialSSL Wildcard, InstantSSL Pro, Premiumssl wildcard, EV SSL, EV SSL SGC.

### 31-Mar-2011
- Free PositiveSSL offer is no longer supported.

### 29-Nov-2010
- Added support for .ASIA registration
- Added extended attributes information for .ASIA domains (Extended Attributes).

### 18-Oct-2010
- Updated extended attributes for .CA registration (Extended Attributes). Removed attributes: CIRA-Registrant, CIRA-Registrant-Desc, CIRA-Org-Registered-In, CIRA-Trademark-No Added attributes: CIRAWhoisDisplay, CIRAAgreementVersion, CIRAAgreementValue, CIRALanguage
- EPP code now required for .CA transfers

### 12-Aug-2010
- Domain registrations, renewals and transfers now allowed for .co domains.

### 05-Aug-2010
- namecheap.domains.transfer.create now supports .de domain transfers.

### 22-Jun-2010
- New command namecheap.domains.transfer.getlist added.

### 19-Jul-2010
- .EU registrations allowed through API.

### 11-Jun-2010
- New optional parameter TTL added in namecheap.domains.dns.sethosts command.

### 17-Feb-2010
- New command namecheap.users.createaddfundsrequest added in sandbox.
- New command namecheap.users.getaddfundsstatus added in sandbox.

### 30-Jan-2010
- New command namecheap.users.login added in sandbox.

### 13-Jan-2010
- New commands namecheap.ssl.resendApproverEmail and namecheap.ssl.resendFulfillmentEmail added.

### 09-Sep-2009
- Added a few more possible values in extended attributes page for .co.uk and .org.uk TLDs.

### 24-Jul-2009
- New optional parameter PhoneExt added in namecheap.users.update commands.
- New optional parameter AdminPhoneExt added in namecheap.ssl.activate command.

### 02-Jun-2009
- New command namecheap.users.getPricing added.

### 30-May-2009
- New optional parameters AddFreeWhoisguard, WGEnabled and AddFreePositiveSSL added in namecheap.domains.create command.
- New command namecheap.domains.getTldlist added.
