import { FC, useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Spinner, View } from "tamagui";
import { WebView } from "react-native-webview";

type MapTheme = "warm" | "bw";

const themeConfigs: Record<MapTheme, { filter: string; bg: string; marker: string }> = {
  warm: {
    filter: "sepia(40%) saturate(70%) hue-rotate(340deg) brightness(1.05)",
    bg: "#f0e8dc",
    marker: "#E89E3F",
  },
  bw: {
    filter: "grayscale(100%) contrast(1.1)",
    bg: "#e5e5e5",
    marker: "#333",
  },
};

interface StaticMapProps {
  latitude: number;
  longitude: number;
  height?: number;
  zoom?: number;
  theme?: MapTheme;
  onPress?: () => void;
}

const buildLeafletHtml = (
  lat: number,
  lng: number,
  zoom: number,
  filter: string,
  bg: string,
  marker: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: ${bg}; }
    #map-wrap { width: 100%; height: 100%; filter: ${filter}; }
    #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map-wrap">
    <div id="map"></div>
  </div>
  <script>
    var map = L.map('map', {
      center: [${lat}, ${lng}],
      zoom: ${zoom},
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    var icon = L.divIcon({
      className: '',
      html: '<div style="position:relative;width:24px;height:32px;">' +
              '<div style="width:24px;height:24px;background:${marker};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,0.35);"></div>' +
            '</div>',
      iconSize: [24, 32],
      iconAnchor: [12, 32],
    });
    L.marker([${lat}, ${lng}], { icon: icon }).addTo(map);
  </script>
</body>
</html>
`;

const StaticMap: FC<StaticMapProps> = ({
  latitude,
  longitude,
  height = 200,
  zoom = 15,
  theme = "bw",
  onPress,
}) => {
  const [loading, setLoading] = useState(true);
  const { filter, bg, marker } = themeConfigs[theme];

  useEffect(() => {
    setLoading(true);
  }, [latitude, longitude]);

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View borderRadius="$8" overflow="hidden" height={height} bgC={bg}>
        {loading && (
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            zIndex={1}
          >
            <Spinner size="small" color={marker} />
          </View>
        )}
        <WebView
          key={`${latitude}-${longitude}-${theme}`}
          source={{ html: buildLeafletHtml(latitude, longitude, zoom, filter, bg, marker) }}
          style={{ flex: 1, opacity: loading ? 0 : 1 }}
          scrollEnabled={false}
          onShouldStartLoadWithRequest={() => true}
          onLoadEnd={() => setLoading(false)}
          pointerEvents="none"
        />
      </View>
    </Pressable>
  );
};

export default StaticMap;
