import { ConflictException } from '@nestjs/common';

/**
 * Checks for a duplicate record in a Prisma model.
 *
 * @param modelDelegate The Prisma model delegate (e.g., prisma.parent)
 * @param field The field to check for uniqueness
 * @param value The value to check
 * @param excludeId Optional ID to exclude from the search (used for updates)
 * @param errorMessage The error message to throw if a duplicate is found
 */
export async function checkDuplicate<T>(
  modelDelegate: {
    findFirst: (args: { where: Record<string, unknown> }) => Promise<T | null>;
  },
  field: 'name' | 'email' | 'phone' | 'level',
  value: string,
  excludeId: string | null,
  errorMessage: string,
): Promise<void> {
  const duplicate = await modelDelegate.findFirst({
    where: {
      [field]: {
        equals: value.trim(),
        mode: 'insensitive',
      },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  if (duplicate) {
    throw new ConflictException(errorMessage);
  }
}
