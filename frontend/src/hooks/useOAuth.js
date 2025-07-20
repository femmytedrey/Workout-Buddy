import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useOAuth = () => {
  const [error, setError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle OAuth callback on component mount
  useEffect(() => {
    const authStatus = searchParams.get("auth");
    const errorParam = searchParams.get("error");

    if (authStatus === "success") {
      setAuthSuccess(true);
      setError(null);
      setSearchParams({}); // Clean URL
    } 
    
    if (errorParam) {
      const errorMessages = {
        auth_failed: "Google authentication failed. Please try again.",
        no_user_data: "Unable to retrieve user information from Google.",
        token_failed: "Login successful but session creation failed.",
        access_denied: "You denied access to your Google account.",
        invalid_client: "OAuth configuration error. Please contact support.",
      };
      
      setError(errorMessages[errorParam] || "Authentication failed. Please try again.");
      setSearchParams({}); // Clean URL
    }
  }, [searchParams, setSearchParams]);

  // Simple login trigger
  const loginMutation = useMutation({
    mutationFn: () => {
      window.location.href = `${process.env.REACT_APP_BASE_URL}/api/user/google`;
      return Promise.resolve();
    },
    onError: () => {
      setError("Failed to initiate Google login");
    }
  });

  return {
    loginWithGoogle: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error,
    authSuccess,
    clearError: () => setError(null)
  };
};

export default useOAuth;