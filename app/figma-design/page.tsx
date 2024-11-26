import FigmaEmbed from "../components/FigmaEmbed";

export default function FigmaDesignPage() {
  const fileUrl =
    "https://www.figma.com/file/HsNAn1JTvE8DACXGxW2eAJ/FORESTアプリ"; // 実際のFigmaファイルURLを挿入

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Figma デザインの表示</h1>
      <FigmaEmbed fileUrl={fileUrl} width="100%" height="600px" />
    </div>
  );
}
