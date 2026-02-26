import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useUsernameAvailability } from '@/hooks/use-checkusername';
import { useDebounce } from '@/hooks/use-debounce';
import { signupSchema } from '@/utils/zod-schema';

type FormValues = z.infer<typeof signupSchema>;
export default function SignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const username = useWatch({
    control,
    name: 'username',
  });

  const debouncedUsername = useDebounce(username, 500);

  const { data: isAvailable, isLoading: checkingUsername } =
    useUsernameAvailability(debouncedUsername.trim());

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) return;
    if (isAvailable === false) {
      setError('username', {
        type: 'manual',
        message: 'Username already taken',
      });
    } else if (isAvailable === true) {
      clearErrors('username');
    }
  }, [debouncedUsername, isAvailable, setError, clearErrors]);

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="names"
                type="text"
                aria-invalid={!!errors.name}
                placeholder="John Doe"
                {...register('name')}
              />
              {errors.name && (
                <FieldDescription className="text-destructive/80">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>
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
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                aria-invalid={!!errors.username}
                placeholder="jhondoe"
                {...register('username')}
              />
              {isAvailable && !checkingUsername && (
                <FieldDescription className="text-primary">
                  Username is available
                </FieldDescription>
              )}
              {checkingUsername && (
                <FieldDescription className="text-muted-foreground">
                  Checking username...
                </FieldDescription>
              )}
              {errors.username && (
                <FieldDescription className="text-destructive/80">
                  {errors.username.message}
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
                  disabled={
                    isSubmitting ||
                    checkingUsername ||
                    Object.keys(errors).length > 0
                  }
                  className="cursor-pointer"
                  type="submit"
                >
                  Create Account
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/signin">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
