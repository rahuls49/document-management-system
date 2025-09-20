'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
            />
          </div>
          <Button onClick={sendOTP} disabled={isPending} className="w-full">
            {isPending ? 'Sending...' : 'Send OTP'}
          </Button>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
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