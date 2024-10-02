"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./action";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  twoFactorActivated: boolean;
};
const TwoFactorAuthForm = ({ twoFactorActivated }: Props) => {
  const { toast } = useToast();
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

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
  return (
    <div>
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
              <QRCodeSVG value={code} />
              <div className="pt-4">
                <Button className="w-full my-2" onClick={()=>setStep(3)}>I have scaned Qr code</Button>
                <Button className="w-full my-2" onClick={()=>setStep(1)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuthForm;
