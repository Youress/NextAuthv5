"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

 

type Props =  {
twoFactorActivated : boolean
}
const TwoFactorAuthForm = ({twoFactorActivated}:Props) => {
    const [isActivated, setIsActivated] = useState(twoFactorActivated);
    const [step, setStep] = useState(1);

    const handleOnClick = async () => {
        setStep(prev => prev +1)
    }
  return (
    <div>
        {!isActivated &&  
        <div>
            {step === 1 && 
            <Button onClick={handleOnClick}>
                Enable Two-Factor Authentication
            </Button>
            }
            {step === 2 && 
            <p>step 2</p>
            }
        </div>
        }
    </div>
  )
}

export default TwoFactorAuthForm