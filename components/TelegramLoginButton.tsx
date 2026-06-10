"use client";

import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";

declare global {
    interface Window {
        onTelegramAuth?: (user: any) => void;
    }
}

const TelegramLoginButton = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        console.log(
            "Telegram bot username:",
            process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
        );

        console.log("Telegram widget loading");

        window.onTelegramAuth = async (user) => {
            alert(JSON.stringify(user, null, 2));

            console.log("Telegram user:", user);

            const result = await signIn("telegram", {
                telegramUser: JSON.stringify(user),
                redirect: false,
            });

            console.log("Telegram login result:", result);

            if (result?.error) {
                alert("Telegram login failed.");
                return;
            }

            window.location.href = "/choose-role";
        };

        if (!containerRef.current) return;

        containerRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;

        script.setAttribute(
            "data-telegram-login",
            process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""
        );
        script.setAttribute("data-size", "medium");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");

        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#229ED9] py-3.5">
            <div ref={containerRef} />
        </div>
    );
};

export default TelegramLoginButton;