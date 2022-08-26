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
  Map as LeafletMap,
  GeoJSON as LeafletGeoJSON,
  Layer as LeafletLayer,
  LeafletMouseEvent,
  latLngBounds,
} from "leaflet";
import VizComponentContext from "../VizComponentContext";
import "leaflet/dist/leaflet.css";
// @ts-ignore
import testMapData from "./precincts_2020.json";

export interface FeatureMapComponentProps {
  mapGeojson?: any;
}

const FeatureMapComponent = (props: FeatureMapComponentProps) => {
  const mapGeojson = props.mapGeojson || testMapData;

  const {
    data,
    groupBy,
    hoveredIds,
    handleMouseOver,
    handleMouseOut,
    handleClick,
    focusIds,
    clearFocusActions,
  } = React.useContext(VizComponentContext);

  const mapRef = React.useRef<LeafletMap>();
  const layerRef = React.useRef<LeafletGeoJSON>();

  const getMapStyle = React.useCallback(
    (feature?: geojson.Feature<geojson.Geometry, any>) => ({
      color: hoveredIds.includes(feature.properties.id) ? "yellow" : "blue",
    }),
    [hoveredIds]
  );

  const onMouseOver = (event: LeafletMouseEvent) => {
    handleMouseOver(event, event.sourceTarget.feature.properties);
  };
  const onMouseOut = (event: LeafletMouseEvent) => {
    handleMouseOut(event, event.sourceTarget.feature.properties);
  };

  const onMouseDown = (event: LeafletMouseEvent) => {
    handleClick(event, event.sourceTarget.feature.properties);
  };

  const onEachFeature = React.useCallback(
    (feature: geojson.Feature<geojson.Geometry, any>, l: LeafletLayer) => {
      //   l.bindTooltip(precinctTooltip(feature));
      l.on({
        mouseover: onMouseOver,
        mouseout: onMouseOut,
        mousedown: onMouseDown,
      });
    },
    []
  );

  React.useLayoutEffect(() => {
    if (mapRef.current && layerRef.current && focusIds && focusIds.length > 0) {
      try {
        mapRef.current.fitBounds(
          latLngBounds(
            layerRef.current
              .getLayers()
              .filter((layer: any) =>
                focusIds.includes(layer.feature.properties[groupBy])
              )
              .map((layer: any) => layer.getBounds())
          )
        );
      } catch (e: any) {
        console.warn(
          "Could not get bounds for current focusIds in `FeatureMap`"
        );
      }
      clearFocusActions();
    }
  }, [focusIds]);

  const mapData = React.useMemo(
    () =>
      mapGeojson && true
        ? data
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
            }))
        : [],
    [mapGeojson]
  );

  if (!mapGeojson) {
    return <p>Map loading...</p>;
  }
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
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      <LayerGroup>
        <GeoJSON
          ref={layerRef}
          data={{ type: "FeatureCollection", features: mapData } as any}
          onEachFeature={onEachFeature}
          style={getMapStyle}
        />
      </LayerGroup>
    </MapContainer>
  );
};

export default FeatureMapComponent;
