export function getAllowedOrigins(): string[] {
  const origins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return origins?.length ? origins : ['http://localhost:3001'];
}
