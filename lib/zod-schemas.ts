import { z } from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1, "You must enter a search term."),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string().min(1).max(100);
export const DescriptionSchema = z.string().max(1000).optional();
export const LatSchema = requiredNumberRange(-90, 90);
export const LongSchema = requiredNumberRange(-180, 180);
export const DateSchema = z.number({
  message: "Date is required",
});

function requiredNumberRange(min: number, max: number) {
  return z.preprocess(
    value => value === "" ? undefined : Number(value),
    z
      .number({ message: "Required" })
      .min(min)
      .max(max),
  );
}
