"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  // クッキーから特定の値を取得
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const userIdCookie = cookies.find((cookie) =>
      cookie.startsWith("user_id=")
    );
    if (userIdCookie) {
      const userIdValue = userIdCookie.split("=")[1];
      setUserId(userIdValue);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!userId ? (
        <>
          <h1>ログインしてください</h1>
          <button onClick={handleLogin}>ログイン</button>
        </>
      ) : (
        <>
          <h1>ようこそ、ユーザー {userId} さん</h1>
          <p>ログイン成功です。</p>
          <Link href={"/figma-design"}>ファイル表示</Link>
        </>
      )}
    </div>
  );
}
