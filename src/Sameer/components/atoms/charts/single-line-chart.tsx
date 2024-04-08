export const PercentLineChart = ({
  percent,
  count,
  title,
  height = 16,
  fillColor = "linear-gradient(135deg, #3C8CE7 0%, #00EAFF 100%)",
}: {
  // should be a number between 0 and 100
  percent: number;
  count?: number;
  height?: number;
  title?: string;
  fillColor?: string;
}) => {
  const fillWidth = `${percent > 100 ? 100 : percent}%`;

  return (
    <div>
      {title && (
        <div className="flex w-[250px] items-baseline justify-between text-xs text-[#545454] lg:w-[300px]">
          <div>
            {title} {count && count !== 0 ? `(${count})` : ""}
          </div>
          <div>{percent.toFixed(0) + "%"}</div>
        </div>
      )}
      <div
        className="relative w-[250px] lg:w-[300px]"
        style={{
          height,
        }}
      >
        <div
          role="presentation"
          className="absolute inset-0 rounded-[35px] bg-gray-200 shadow-inner"
        ></div>
        <div
          role="presentation"
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: fillWidth,
            background: fillColor,
            borderRadius: "35px",
          }}
        ></div>
      </div>
    </div>
  );
};
