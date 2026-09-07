"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { PhoneField } from "@/features/auth/components/PhoneField";
import { useLoginMutation } from "@/features/auth/api/auth.api";
import { setCredentials } from "@/features/auth/slice/auth.slice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { parseApiError } from "@/lib/api/parseApiError";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [dialCode, setDialCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const phoneValid = digitsOnly(phone).length >= 6;
  const nameValid = name.trim().length >= 2;
  const canSubmit = phoneValid && nameValid && !isLoading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!phoneValid || !nameValid) return;

    try {
      const result = await login({
        phone: `${dialCode}${digitsOnly(phone)}`,
        name: name.trim(),
      }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/chat");
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      <Field
        label="Your full name"
        error={touched && !nameValid ? "Enter your name (at least 2 characters)" : undefined}
      >
        {({ id, invalid }) => (
          <Input
            id={id}
            leadingIcon={<User className="size-4" />}
            placeholder="Your full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={invalid}
          />
        )}
      </Field>
      <Field
        label="Phone number"
        error={touched && !phoneValid ? "Enter a valid phone number" : undefined}
      >
        {({ id, invalid }) => (
          <PhoneField
            id={id}
            dialCode={dialCode}
            onDialCodeChange={setDialCode}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            invalid={invalid}
          />
        )}
      </Field>

      <Button type="submit" size="lg" loading={isLoading} disabled={!canSubmit}>
        Continue
        {!isLoading && <ArrowRight className="size-4" />}
      </Button>

      <p className="text-center text-xs text-ink-muted">
        New phone numbers are automatically registered.
      </p>
    </form>
  );
}
