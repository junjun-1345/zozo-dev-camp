import FigmaPrototypeEmbed from "../components/FigmaPrototypeEmbed";

export default function FigmaPrototypePage() {
  const prototypeUrl =
    // "https://www.figma.com/proto/{file_key}/{prototype_name}?node-id={node_id}&scaling=scale-down&page-id={page_id}";
    "https://www.figma.com/proto/HsNAn1JTvE8DACXGxW2eAJ/FOREST%E3%82%A2%E3%83%97%E3%83%AA?node-id=261-1415&t=yAT8SZjEgCPdPzKP-1";

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Figma プロトタイプの表示</h1>
      <FigmaPrototypeEmbed
        prototypeUrl={prototypeUrl}
        width="100%"
        height="600px"
      />
    </div>
  );
}
