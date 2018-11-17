'use strict'

import React from 'react'
import { TheMap, TheMapStyle } from 'the-map'
import { TheSpinStyle } from 'the-spin'

// @see https://leaflet-extras.github.io/leaflet-providers/preview/
const MapLayers = [
  {
    key: 'layer01',
    title: 'Layer 01',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  {
    key: 'layer02',
    title: 'Layer 02',
    url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
]

class ExampleComponent extends React.Component {
  handleLeafletMap = (map) => {
    this.map = map
  }
  handleChange = ({ lat, lng, zoom, bounds: { west, south, east, north } }) => {
    this.setState({ lat, lng, zoom })
    console.log('bounds', { west, south, east, north })
  }

  moveToCurrent = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude: lat, longitude: lng } = coords
      this.setState({ lat, lng })
    }, () => alert('Failed to get current position'))
  }

  handleClick = ({ lat, lng }) => {
    console.log('lat, lng', lat, lng)
  }

  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
    markers: [
      {
        key: 'marker-01',
        lat: 51.505,
        lng: -0.09,
        onClick: () => console.log('marker01 clicked'),
        node: (
          <div style={{
            borderRadius: '50%',
            textAlign: 'center',
            background: '#E33',
            width: 48,
            height: 48,
            color: 'white',
            lineHeight: '48px',
          }}>
            <div>Mrkr01</div>
          </div>
        ),
      }
    ]
  }

  render () {
    const { state: { lat, lng, zoom, markers } } = this
    return (
      <div>
        <TheSpinStyle/>
        <TheMapStyle/>
        <TheMap onLeafletMap={this.handleLeafletMap}
                onChange={this.handleChange}
                {...{ lat, lng, zoom }}
                width={'100%'}
                height={'50vh'}
                layers={MapLayers}
                onClick={this.handleClick}
                markers={markers}
        >
        </TheMap>

        <hr/>

        <button
          onClick={this.moveToCurrent}>Move to current
        </button>
      </div>

    )
  }
}

export default ExampleComponent
