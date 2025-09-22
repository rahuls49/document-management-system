import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import LeftPanel from '@/components/auth/LeftPanel';

export default function LoginPage() {
  return (
      <div className="flex w-full h-screen shadow-lg overflow-hidden">
        <LeftPanel/>
        <div className="flex flex-1 items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Light decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-16 right-12 w-24 h-24 bg-blue-200 rounded-full"></div>
                <div className="absolute bottom-32 left-20 w-16 h-16 bg-indigo-200 rounded-full"></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-200 rounded-full"></div>
            </div>
            <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
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
