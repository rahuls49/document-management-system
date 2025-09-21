import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import LeftPanel from '@/components/auth/LeftPanel';

export default function LoginPage() {
  return (
      <div className="flex w-full h-screen shadow-lg overflow-hidden">
        <LeftPanel/>
        <div className="flex flex-1 items-center justify-center p-6 ">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Hey, Hello 👋</CardTitle>
              <CardDescription>
                Please Login to access the Document Management System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
