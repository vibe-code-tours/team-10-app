"use client";

import { useCallback, useState } from "react";
import type { z } from "zod";

type Values = Record<string, string>;
type Errors<T extends Values> = Partial<Record<keyof T, string>>;

export function useFormValidation<T extends Values>(
  schema: z.ZodType<unknown>,
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
    {},
  );

  const validate = useCallback(
    (candidate: T) => {
      const result = schema.safeParse(candidate);
      if (result.success) {
        setErrors({});
        return true;
      }
      const nextErrors: Errors<T> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof T | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return false;
    },
    [schema],
  );

  const handleChange = useCallback(
    (field: keyof T, value: string) => {
      const next = { ...values, [field]: value };
      setValues(next);
      if (touched[field]) {
        validate(next);
      }
    },
    [values, touched, validate],
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validate(values);
    },
    [values, validate],
  );

  const validateAll = useCallback(() => {
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      ),
    );
    return validate(values);
  }, [values, validate]);

  return { values, errors, handleChange, handleBlur, validateAll, setValues };
}
