import { z } from "zod"

export const SearchSchema = z.object({
  searchTerm: z.string().min(1, { message: "Please enter a domain name to search." }),
  selectedTlds: z.array(z.string()).min(1, { message: "Please select at least one TLD." }),
})

export const RegistrationSchema = z.object({
  years: z.string().transform(Number),
  registrantInfo: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    address1: z.string().min(1, "Address is required."),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required."),
    stateProvince: z.string().min(1, "State/Province is required."),
    postalCode: z.string().min(1, "Postal code is required."),
    country: z.string().min(1, "Country is required."),
    phone: z
      .string()
      .min(1, "Phone number is required.")
      .regex(/^\+\d{1,3}\.\d+$/, "Invalid format. Use +1.1234567890"),
    emailAddress: z.string().email("Invalid email address."),
    organizationName: z.string().optional(),
    jobTitle: z.string().optional(),
  }),
  whoisguard: z.boolean().default(true),
})

export const HostingSchema = z.object({
  hostingUsername: z
    .string()
    .min(3, "Username must be 3-16 characters.")
    .max(16, "Username must be 3-16 characters.")
    .regex(/^[a-z][a-z0-9]{2,15}$/, "Must start with a letter and contain only lowercase letters and numbers."),
  hostingPassword: z.string().min(8, "Password must be at least 8 characters long."),
  plan: z.enum(["webcrtae_basic", "webcrtae_pro", "webcrtae_elite"], {
    required_error: "You must select a hosting plan.",
  }),
})
