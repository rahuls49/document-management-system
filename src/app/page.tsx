import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your mobile number to receive OTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
