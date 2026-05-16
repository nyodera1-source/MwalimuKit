import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
  }>;
}

function getSafeCallbackUrl(value: string | string[] | undefined) {
  const callbackUrl = Array.isArray(value) ? value[0] : value;
  if (!callbackUrl) return "/dashboard";
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/dashboard";
  }
  if (callbackUrl.startsWith("/login") || callbackUrl.startsWith("/signup")) {
    return "/dashboard";
  }
  return callbackUrl;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(params?.callbackUrl);

  return <LoginForm callbackUrl={callbackUrl} />;
}
