'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';

// Validation Schemas
const mobileSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be 4 digits.'),
});

const signupSchema = z
  .object({
    pin: z.string().length(4, 'PIN must be 4 digits.'),
    confirmPin: z.string().length(4, 'PIN must be 4 digits.'),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  });

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState('mobile'); // "mobile" | "login" | "signup"
  const [mobileNumber, setMobileNumber] = useState('');

  const form = useForm({
    resolver: zodResolver(
      step === 'mobile'
        ? mobileSchema
        : step === 'login'
        ? pinSchema
        : signupSchema
    ),
    defaultValues: {
      mobile: '',
      pin: '',
      confirmPin: '',
    },
  });

  const handleMobileSubmit = (values) => {
    const userExists = mockUsers.some((u) => u.mobileNumber === values.mobile);
    setMobileNumber(values.mobile);
    if (userExists) {
      setStep('login');
    } else {
      setStep('signup');
    }
    form.reset({ mobile: values.mobile, pin: '', confirmPin: '' });
  };

  const handleLoginSubmit = (values) => {
    const user = mockUsers.find(
      (u) => u.mobileNumber === mobileNumber && u.pin === values.pin
    );

    if (user) {
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid PIN.',
      });
    }
  };

  const handleSignupSubmit = (values) => {
    // In a real app, you would save the new user to the database.
    console.log('New user created:', { mobile: mobileNumber, pin: values.pin });
    toast({
      title: 'Account Created!',
      description: 'Welcome to The Quizway! You can now use the app.',
    });
    // For this mock, we'll just log them in.
    router.push('/dashboard');
  };

  const onSubmit = form.handleSubmit((data) => {
    if (step === 'mobile') {
      handleMobileSubmit(data);
    } else if (step === 'login') {
      handleLoginSubmit(data);
    } else {
      handleSignupSubmit(data);
    }
  });

  const goBack = () => {
    setStep('mobile');
    form.reset({ mobile: mobileNumber, pin: '', confirmPin: '' });
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {step !== 'mobile' && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{mobileNumber}</span>
          </Button>
        )}

        {step === 'mobile' && (
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step === 'login' && (
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your 4-Digit PIN</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step === 'signup' && (
          <>
            <p className="text-sm text-center text-muted-foreground">
              This number isn&apos;t registered. Let&apos;s create an account.
            </p>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create a 4-Digit PIN</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm PIN</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full">
          {step === 'mobile' && 'Continue'}
          {step === 'login' && 'Login'}
          {step === 'signup' && 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
