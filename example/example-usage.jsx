'use strict'

import React from 'react'
import { TheMap, TheMapStyle } from 'the-map'

class ExampleComponent extends React.Component {
  handleLeaflet = (leaflet) => {
    console.log(leaflet)
  }

  render () {
    return (
      <div>
        <TheMapStyle/>
        <TheMap onLeaflet={this.handleLeaflet}>
        </TheMap>
      </div>

    )
  }
}

export default ExampleComponent
