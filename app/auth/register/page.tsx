import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create account — ArriveFrance",
    description: "Create your free ArriveFrance account and start your admin checklist.",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
