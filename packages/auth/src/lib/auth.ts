import { profile } from "@maany_shr/e-class-models";
export function auth(): string {
  const schema = profile.ProfilesSchema;
  schema.safeParse({} as any);
  return 'auth';
}
