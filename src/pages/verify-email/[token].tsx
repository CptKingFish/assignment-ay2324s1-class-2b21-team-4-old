import React from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";


const Token = () => {
    const router = useRouter();
    const { mutate: verifyEmail } = api.auth.verifyEmail.useMutation();
    const { token } = router.query;    

    const handleSubmit = () => {
        verifyEmail({token : token as string}, 
            {
                onSuccess: (data) => {
                    toast.success(data);
                    router.push("/authenticate").catch(console.error);
                },
                onError: (e) => {
                    toast.error(e.message);
                },
            }

        )    
    }


    return (
        <>
            <div className="flex h-screen flex-col items-center justify-center gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                >
                    Verify Email
                </button>
            </div>
        </>
    )
}
export default Token