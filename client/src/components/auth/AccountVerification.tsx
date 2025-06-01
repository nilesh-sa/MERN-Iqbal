import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getAxiosErrorMessage, verifyUserAccountApiHandler } from "@/services/api";
import { toast } from "sonner";

type VerificationStatus = "loading" | "success" | "error";

const AccountVerification: React.FC = () => {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const location = useLocation();
 const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await verifyUserAccountApiHandler(token);
        if (res.status === 200) {
          setStatus("success");
          toast.success("Account verified successfully!");
        } else {
          setStatus("error");
        }
      } catch (error) {
        const errMes = getAxiosErrorMessage(error);
        toast.error(`Verification failed: ${errMes}`);
        setStatus("error");
      }
    };

    verifyAccount();
  }, [location.search]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Loading State */}
        {status === "loading" && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 transform hover:shadow-xl">
            <Loader2 className="text-blue-600 mx-auto w-12 h-12 mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying your account
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your account...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-green-500 transition-all duration-300 transform hover:shadow-xl">
            <CheckCircle className="text-green-500 mx-auto w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Account Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully verified.
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 w-full"
              onClick={() => navigate('/')}
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-red-500 transition-all duration-300 transform hover:shadow-xl">
            <XCircle className="text-red-500 mx-auto w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">
              The verification token is invalid or has expired.
            </p>
            <p className="text-gray-600 mb-6">
              Please request a new verification link.
            </p>
            <div className="space-y-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 w-full"
                onClick={()=>navigate('/')}
              >
                Go to Home 
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountVerification;