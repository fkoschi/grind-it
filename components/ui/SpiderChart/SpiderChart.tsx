import React, { useMemo } from "react";
import {
  Svg,
  Polygon,
  Line,
  Circle,
  Text as SvgText,
  G,
} from "react-native-svg";
import { tokens } from "@/tamagui.config";
import { View } from "tamagui";

export interface SpiderChartData {
  label: string;
  value: number; // 0 to 100
}

interface SpiderChartProps {
  data: SpiderChartData[];
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const SpiderChart: React.FC<SpiderChartProps> = ({
  data,
  size = 300,
  color,
  backgroundColor = "transparent",
}) => {
  const primaryColor = color || tokens.color.primary.val;
  const secondaryColor = tokens.color.secondary.val;
  const textColor = tokens.color.copyText.val;

  const radius = size / 2;
  const center = size / 2;
  const chartRadius = radius * 0.75; // Leave space for labels

  const angleStep = (2 * Math.PI) / data.length;

  const calculatePoint = (value: number, index: number, maxRadius: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const gridPolygons = useMemo(() => {
    return gridLevels.map((level) => {
      const points = data
        .map((_, index) => {
          const { x, y } = calculatePoint(level, index, chartRadius);
          return `${x},${y}`;
        })
        .join(" ");
      return { level, points };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartRadius]);

  const dataPolygonPoints = useMemo(() => {
    return data
      .map((item, index) => {
        const { x, y } = calculatePoint(item.value, index, chartRadius);
        return `${x},${y}`;
      })
      .join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartRadius]);

  const axes = useMemo(() => {
    return data.map((item, index) => {
      const { x, y } = calculatePoint(100, index, chartRadius);
      const labelPoint = calculatePoint(115, index, chartRadius); // Place label slightly outside
      return { x, y, labelPoint, label: item.label };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartRadius]);

  const dataPoints = useMemo(() => {
    return data.map((item, index) => {
      return calculatePoint(item.value, index, chartRadius);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartRadius]);

  return (
    <View width={size} height={size} backgroundColor={backgroundColor}>
      <Svg width={size} height={size}>
        {/* Grid Polygons */}
        {gridPolygons.map(({ level, points }) => (
          <Polygon
            key={level}
            points={points}
            stroke={secondaryColor}
            strokeWidth="1"
            strokeOpacity={0.3}
            fill="none"
          />
        ))}

        {/* Axes */}
        {axes.map((axis, index) => (
          <G key={index}>
            <Line
              x1={center}
              y1={center}
              x2={axis.x}
              y2={axis.y}
              stroke={secondaryColor}
              strokeWidth="1"
              strokeOpacity={0.3}
            />
            <SvgText
              x={axis.labelPoint.x}
              y={axis.labelPoint.y}
              fill={textColor}
              fontSize="12"
              fontFamily="DarkerGrotesque_500Medium" // Using theme font
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {axis.label}
            </SvgText>
          </G>
        ))}

        {/* Data Polygon */}
        <Polygon
          points={dataPolygonPoints}
          fill={primaryColor}
          fillOpacity={0.2}
          stroke={primaryColor}
          strokeWidth="2"
        />

        {/* Data Points */}
        {dataPoints.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="2" fill="black" />
        ))}
      </Svg>
    </View>
  );
};

export default SpiderChart;
