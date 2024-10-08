"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { activate2fa, disabled2fa, get2faSecret } from "./action";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas  } from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = {
  twoFactorActivated: boolean;
};
const TwoFactorAuthForm = ({ twoFactorActivated }: Props) => {
  const { toast } = useToast();
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleOnClick = async () => {
    const res = await get2faSecret();
    if (res.error) {
      toast({
        variant: "destructive",
        title: res.message,
      });
      return;
    }
    setStep(2);
    setCode(res.twoFactorSecret ?? "");
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await activate2fa(otp);
    if (res?.error) {
      toast({
        variant: "destructive",
        title: res.message,
      });
      return;
    }
    toast({
      className: "bg-green-500 text-white",
      title: "Two-factor authentication has been enabled",
    });
    setIsActivated(true);
  };
  const handleDisabled = async () => {
    await disabled2fa()
    toast({
      className: "bg-green-500 text-white",
      title: "Two-factor authentication has been disabled",
    })
    setIsActivated(false)
  }
  return (
    <div>
      {!!isActivated && 
      <Button variant="destructive" onClick={handleDisabled}>Disable Two-factor authentication</Button>}
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleOnClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs text-muted-foreground py-2">
                Scan the Qr code below
              </p>
              <QRCodeCanvas  value={code} />
              <div className="pt-4">
                <Button className="w-full my-2" onClick={() => setStep(3)}>
                  I have scaned Qr code
                </Button>
                <Button
                  className="w-full my-2"
                  onClick={() => setStep(1)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground py-2">
                Please enter OTP
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit">
                Submit to activate
              </Button>
              <Button onClick={() => setStep(2)} variant="outline">
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuthForm;
