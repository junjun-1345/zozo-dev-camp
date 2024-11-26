interface FigmaPrototypeEmbedProps {
  prototypeUrl: string; // プロトタイプのURL
  width?: string;
  height?: string;
}

const FigmaPrototypeEmbed: React.FC<FigmaPrototypeEmbedProps> = ({
  prototypeUrl,
  width = "100%",
  height = "600px",
}) => {
  return (
    <iframe
      style={{ border: "none" }}
      width={width}
      height={height}
      src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
        prototypeUrl
      )}`}
      allowFullScreen
    ></iframe>
  );
};

export default FigmaPrototypeEmbed;
