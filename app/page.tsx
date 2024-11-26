"use client";

import { useState } from "react";

export default function Home() {
  const [accessToken] = useState<string | null>(null);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const fetchFigmaFiles = async () => {
    if (!accessToken) {
      alert("ログインが必要です");
      return;
    }

    try {
      const response = await fetch("/api/figma-files", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      console.log("Figma files:", data);
    } catch (error) {
      console.error("Failed to fetch Figma files:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!accessToken ? (
        <>
          <h1>ログインしてください</h1>
          <button onClick={handleLogin}>Figmaでログイン</button>
        </>
      ) : (
        <>
          <h1>ログイン成功</h1>
          <button onClick={fetchFigmaFiles}>Figmaファイルを取得</button>
        </>
      )}
    </div>
  );
}
