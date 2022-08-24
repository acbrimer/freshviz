import * as React from "react";
import { useState, useMemo } from "react";

import * as geojson from "geojson";
import * as _ from "lodash";
import {
  TileLayer,
  MapContainer,
  ZoomControl,
  GeoJSON,
  LayerGroup,
} from "react-leaflet";
import {
  Layer as LeafletLayer,
  LeafletMouseEvent,
  latLngBounds,
} from "leaflet";
import VizComponentContext from "../VizComponentContext";
import "leaflet/dist/leaflet.css";
// @ts-ignore
import mapData from "./precincts_2020.json";

export interface FeatureMapComponentProps {
  mapSource: string;
}

const FeatureMapComponent = (props: FeatureMapComponentProps) => {
  const { mapSource } = props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy, hoveredIds } = c;

  const [mapDataLoading, setMapDataLoading] = React.useState(true);

  const getMapStyle = React.useCallback(
    (feature?: geojson.Feature<geojson.Geometry, any>) => ({
      color: hoveredIds.includes(feature.properties.id) ? "yellow" : "blue",
    }),
    [hoveredIds]
  );

  const onEachFeature = React.useCallback(
    (feature: geojson.Feature<geojson.Geometry, any>, l: LeafletLayer) => {
      //   l.bindTooltip(precinctTooltip(feature));
      l.on({
        mouseover: (e: any) => {},
        mouseout: (e: any) => {},
        mousedown: (e: any) => {},
      });
    },
    []
  );

  React.useEffect(() => {
    console.log("hoveredIds changed", hoveredIds);
  }, [hoveredIds]);

  return (
    <MapContainer
      style={{ width: "100%", height: "100%" }}
      bounds={latLngBounds(
        { lat: 37.00231831600007, lng: -94.43066908599997 },
        { lat: 33.61579299500005, lng: -103.00246431499994 }
      ).pad(0.1)}
      maxBounds={latLngBounds(
        { lat: 37.00231831600007, lng: -94.43066908599997 },
        { lat: 33.61579299500005, lng: -103.00246431499994 }
      ).pad(0.1)}
      //   ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      <LayerGroup>
        <GeoJSON
          //   ref={setLayer}
          data={mapData}
          onEachFeature={onEachFeature}
          style={getMapStyle}
        />
      </LayerGroup>
    </MapContainer>
  );
};

export default FeatureMapComponent;
