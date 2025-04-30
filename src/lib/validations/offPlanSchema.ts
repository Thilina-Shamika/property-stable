import { z } from "zod";

export const offPlanFormSchema = z.object({
  title: z.string().optional(),
  propertyType: z.string().optional(),
  price: z.string().optional(),
  installment1: z.string().optional(),
  installment2: z.string().optional(),
  handoverDate: z.string().optional(),
  description: z.string().optional(),
  escrowNumber: z.string().optional(),
  projectNumber: z.string().optional(),
  images: z.any().optional(),
  logo: z.any().optional(),
  brochure: z.any().optional(),
  qrCode: z.any().optional(),
  developer: z.object({
    name: z.string().optional()
  }).optional(),
  location: z.string().optional(),
  dldPermitNumber: z.string().optional()
});

export type OffPlanFormValues = z.infer<typeof offPlanFormSchema>; 