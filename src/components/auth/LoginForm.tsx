'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Phone, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sendOTP = () => {
    if (!mobile || mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    startTransition(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documentManagement/generateOTP`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile_number: mobile }),
        });
        const data = await response.json();
        if (data.status && data.data === 'OTP Sent on SMS and WhatsApp') {
          setStep('otp');
          toast.success('OTP sent successfully!');
        } else {
          toast.error('Failed to send OTP. Please try again.');
        }
      } catch {
        toast.error('Network error. Please try again.');
      }
    });
  };

  const verifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    startTransition(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documentManagement/validateOTP`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile_number: mobile, otp }),
        });
        const data = await response.json();
        if (data.status) {
          toast.success('Login successful!');
          router.push('/document-management');
        } else {
          toast.error('Invalid OTP. Please try again.');
        }
      } catch {
        toast.error('Network error. Please try again.');
      }
    });
  };

  return (
    <>
      {step === 'mobile' ? (
        <>
          <div className='mb-6'>
            <Label htmlFor="mobile">Mobile Number</Label>
            <p className="text-sm text-muted-foreground mb-2">Enter your registered mobile number</p>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className="pl-10 h-12 text-sm sm:text-2xl"
              />
            </div>
          </div>
          <Button onClick={sendOTP} disabled={isPending} className="w-full">
            {isPending ? 'Sending...' : 'Send OTP'}
          </Button>
        </>
      ) : (
        <>
          <div className='mb-6'>
            <Label htmlFor="otp" className="flex items-center gap-2">
              <ShieldCheck size={16} />
              OTP
            </Label>
            <p className="text-sm text-muted-foreground mb-2">Enter the 6-digit code sent to your mobile</p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="text-2xl h-12 w-12" />
                  <InputOTPSlot index={1} className="text-2xl h-12 w-12" />
                  <InputOTPSlot index={2} className="text-2xl h-12 w-12" />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} className="text-2xl h-12 w-12 border" />
                  <InputOTPSlot index={4} className="text-2xl h-12 w-12" />
                  <InputOTPSlot index={5} className="text-2xl h-12 w-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button onClick={verifyOTP} disabled={isPending} className="w-full">
            {isPending ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button variant="outline" onClick={() => setStep('mobile')} className="w-full">
            Back
          </Button>
        </>
      )}
    </>
  );
}