import { type ZodType, type z } from 'zod';

export type ValidationResult<T> = { success: true; data: T } | { success: false; message: string };

export function createValidator<TSchema extends ZodType<any, any, any>, TOutput = z.infer<TSchema>>(
  schema: TSchema,
  defaultErrorMessage = 'Dados inválidos.',
  transform?: (data: z.infer<TSchema>) => TOutput,
) {
  return (data: unknown): ValidationResult<TOutput> => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const issue = result.error.issues[0];
      return {
        success: false,
        message: issue?.message ?? defaultErrorMessage,
      };
    }

    const finalData = transform ? transform(result.data) : result.data;

    return {
      success: true,
      data: finalData,
    };
  };
}
