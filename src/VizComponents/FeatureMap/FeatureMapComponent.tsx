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
import mapGeojson from "./precincts_2020.json";

export interface FeatureMapComponentProps {
  mapSource: string;
}

const FeatureMapComponent = (props: FeatureMapComponentProps) => {
  const { mapSource } = props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy, hoveredIds, handleMouseOver, handleMouseOut } = c;

  const getMapStyle = React.useCallback(
    (feature?: geojson.Feature<geojson.Geometry, any>) => ({
      color: hoveredIds.includes(feature.properties.id) ? "yellow" : "blue",
    }),
    [hoveredIds]
  );

  const onMouseOver = (event: LeafletMouseEvent) => {
    console.log("mouseOver", event.sourceTarget.feature.properties);
    handleMouseOver(event, event.sourceTarget.feature.properties);
  };
  const onMouseOut = (event: LeafletMouseEvent) => {
    handleMouseOut(event, event.sourceTarget.feature.properties);
  };

  const onEachFeature = React.useCallback(
    (feature: geojson.Feature<geojson.Geometry, any>, l: LeafletLayer) => {
      //   l.bindTooltip(precinctTooltip(feature));
      l.on({
        mouseover: onMouseOver,
        mouseout: onMouseOut,
        mousedown: (e: any) => {},
      });
    },
    []
  );

  React.useEffect(() => {
    console.log("hoveredIds changed", hoveredIds);
  }, [hoveredIds]);

  const mapData = React.useMemo(
    () =>
      data
        .map((d: any) => ({
          data: d,
          feature: _.find(mapGeojson.features, {
            properties: { id: d[groupBy] },
          }),
        }))
        .filter((f: any) => f.feature && true)
        .map((f: any) => ({
          ...f.feature,
          properties: { ...f.feature.properties, ...f.data },
        })),
    []
  );

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
          data={{ type: "FeatureCollection", features: mapData as any }}
          onEachFeature={onEachFeature}
          style={getMapStyle}
        />
      </LayerGroup>
    </MapContainer>
  );
};

export default FeatureMapComponent;
