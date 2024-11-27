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

  const handleLogout = async () => {
    // サーバーサイドのログアウトエンドポイントを呼び出す
    await fetch("/api/auth/logout", { method: "GET" });
    // クライアントサイドのクッキーを削除
    document.cookie = "user_id=; Max-Age=0; path=/";
    // ユーザーIDをリセット
    setUserId(null);
    // トップページにリダイレクト
    window.location.href = "/";
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      {!userId ? (
        <>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            ログインしてください
          </h1>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            ログイン
          </button>
        </>
      ) : (
        <>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            ようこそ、ユーザー {userId} さん
          </h1>
          <p style={{ fontSize: "18px", marginBottom: "30px" }}>
            ログイン成功です。
          </p>
          <div style={{ marginBottom: "20px" }}>
            <Link
              href={"/file-select"}
              style={{
                fontSize: "16px",
                color: "#0070f3",
                textDecoration: "none",
                padding: "10px 15px",
                border: "1px solid #0070f3",
                borderRadius: "5px",
                transition: "background-color 0.3s",
              }}
            >
              ファイルの選択
            </Link>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            ログアウト
          </button>
        </>
      )}
    </div>
  );
}
