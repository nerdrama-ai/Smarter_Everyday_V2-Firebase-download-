import { AuthForm } from '@/components/auth/AuthForm';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-4">
              <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight font-headline">
            Welcome to The Quizway
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your mobile number to login or create an account.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
