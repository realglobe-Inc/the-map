'use strict'

import React from 'react'
import { TheMap, TheMapStyle } from 'the-map'
import { TheSpinStyle } from 'the-spin'

// @see https://leaflet-extras.github.io/leaflet-providers/preview/
const MapLayers = [
  ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }],
  ['https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }],
]

class ExampleComponent extends React.Component {
  handleLeaflet = (leaflet) => {
    this.leaflet = leaflet
  }
  handleChange = ({ lat, lng, zoom }) => {
    this.setState({ lat, lng, zoom })
  }

  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  render () {
    const { state: { lat, lng, zoom } } = this
    return (
      <div>
        <TheSpinStyle/>
        <TheMapStyle/>
        <TheMap onLeaflet={this.handleLeaflet}
                onChange={this.handleChange}
                {...{ lat, lng, zoom }}
                width={'100%'}
                height={'50vh'}
                layers={MapLayers}
        >
        </TheMap>
      </div>

    )
  }
}

export default ExampleComponent
