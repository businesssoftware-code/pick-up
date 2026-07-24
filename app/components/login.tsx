"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";
import TopLineCard from "./top-line-card";
import PrimaryButton from "./primary-button";
import { getErrorMessage } from "../libs/axios";

export default function LoginPage() {
  const { login, accessToken, loading } = useAuth();
  const router = useRouter();
  const [details, setDetails] = useState<{
    driverCode: string;
    password: string;
  }>({
    driverCode: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && accessToken) {
      router.push("/trips");
    }
  }, [loading, accessToken, router]);

  const onChange = (name: string, value: string) => {
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    if (!details.driverCode || !details.password) {
      toast.info("Please enter driver name and password", {
        duration: 3000,
      });
      return;
    }

    const toastId = toast.loading("Loading...");
    setSubmitting(true);
    try {
      await login({
        driverCode: details.driverCode.trim(),
        password: details.password,
      });
      toast.success("Login Successful!", { id: toastId });
      router.push("/trips");
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId, duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="self-start">
          <h1 className="text-heading4 font-regular text-primary">
            Dispatch Hub
          </h1>
        </div>

        <TopLineCard minHeight="h-[274px]" topColor="bg-secondary">
          <div className="flex flex-1 flex-col">
            <div className="flex h-[33px] items-center p-3">
              <h1 className="text-bodyLarge text-primary">Login Details</h1>
            </div>
            <hr className="border-t border-neutralBg drop-shadow-custom" />

            <div className="flex flex-1 flex-col items-center justify-evenly px-10">
              <div className="flex flex-col gap-2">
                <h1 className="text-bodyRegular text-primary">Your Code</h1>
                <input
                  type="text"
                  className="h-[33px] w-[274px] rounded-[16.5px] border-[1px] border-neutralBg px-5 focus:outline-none"
                  placeholder="e.g. BAS-12"
                  name="driverCode"
                  value={details.driverCode || ""}
                  onChange={(e) => {
                    console.log(e.target.value, "sdnkfkhfkf");
                    setDetails((prev) => ({
                      ...prev,
                      driverCode: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-bodyRegular text-primary">Password</h1>
                <input
                  type="password"
                  className="h-[33px] w-[274px] rounded-[16.5px] border-[1px] border-neutralBg px-5 focus:outline-none"
                  placeholder="Enter your password"
                  name="password"
                  value={details.password || ""}
                  onChange={(e) => onChange("password", e.target.value)}
                />
              </div>
            </div>
          </div>
        </TopLineCard>

        <div className="relative z-0 mt-5">
          <div className="relative z-10">
            <PrimaryButton
              onPress={onSubmit}
              title={submitting ? "Signing in…" : "Login"}
              textColor="text-secondary"
            />
          </div>

          {/*
            The original app anchors a branded illustration here:
              <Image src="/images/lessgo.png" alt="lessGo" ... />
            Add a driver/vehicle-themed illustration to public/images/ and
            drop it back in the same way if you want the same flourish —
            left out for now since there's no asset for it yet.
          */}
        </div>
      </motion.div>
    </div>
  );
}
