interface FigmaEmbedProps {
  fileUrl: string; // FigmaファイルのURL
  width?: string;
  height?: string;
}

const FigmaEmbed: React.FC<FigmaEmbedProps> = ({
  fileUrl,
  width = "100%",
  height = "600px",
}) => {
  return (
    <iframe
      style={{ border: "none" }}
      width={width}
      height={height}
      src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
        fileUrl
      )}`}
      allowFullScreen
    ></iframe>
  );
};

export default FigmaEmbed;
