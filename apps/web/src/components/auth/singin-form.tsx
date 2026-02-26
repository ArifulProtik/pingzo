import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/utils/zod-schema';

type FormValues = z.infer<typeof signInSchema>;
export default function SignInForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    });

    if (res.error) {
      setSubmitError(res.error.message);
    } else {
      router.navigate({
        to: '/',
      });
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your information below to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className="mb-4 text-center text-destructive/80">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
                placeholder="m@example.com"
                {...register('email')}
              />
              {errors.email && (
                <FieldDescription className="text-destructive/80">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                aria-invalid={!!errors.password}
                placeholder="password"
                {...register('password')}
              />
              {errors.password && (
                <FieldDescription className="text-destructive/80">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="cursor-pointer"
                  type="submit"
                >
                  Sign In
                </Button>

                <FieldDescription className="px-6 text-center">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
