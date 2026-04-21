"use client";

import { useActionState, useEffect } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { signInAction } from "@/app/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = {
  status: "idle" as const,
  message: undefined as string | undefined,
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const { language, t } = useLanguage();
  const { pushToast } = useToast();

  useEffect(() => {
    if (state.status === "error" && state.message) {
      pushToast(state.message, "error");
    }
  }, [pushToast, state.message, state.status]);

  return (
    <form action={formAction} className="login-form">
      <input type="hidden" name="language" value={language} />

      <label className="field">
        <span>{t["auth.email"]}</span>
        <div className="input-icon">
          <Mail size={16} />
          <Input
            id="email"
            type="email"
            name="email"
            required
            placeholder="martina@redi-ngo.eu"
          />
        </div>
      </label>

      <label className="field">
        <span>{t["auth.password"]}</span>
        <div className="input-icon">
          <LockKeyhole size={16} />
          <Input id="password" type="password" name="password" required minLength={8} />
        </div>
      </label>

      <Button type="submit" fullWidth isLoading={pending}>
        {t["auth.signIn"]}
      </Button>
    </form>
  );
}
