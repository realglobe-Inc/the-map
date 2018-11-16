'use strict'

import c from 'classnames'
import L from 'leaflet'
import PropTypes from 'prop-types'
import React from 'react'
import { changedProps, eventHandlersFor, htmlAttributesFor, newId } from 'the-component-util'
import { TheSpin } from 'the-spin'
import TileLayer from './classes/TileLayer'

/**
 * Geo map for the-components
 */
class TheMap extends React.Component {
  constructor (props) {
    super(props)
    this.leaflet = null
    this.leafletLayers = {}
    this.mapElmRef = React.createRef()
    this.mapElmId = newId({ prefix: 'the-map' })
    this.state = {}
    this.mapEventHandlers = {
      load: () => {
      },
      moveend: (e) => {
        this.needsChange()
      },
      resize: () => {
        this.needsChange()
      },
      unload: () => {
      },
      zoomend: (e) => {
        this.needsChange()
      },
    }
  }

  applyLayers (layers) {
    const { leaflet } = this
    if (!leaflet) {
      return
    }
    const { leafletLayers } = this
    {
      const layersToAdd = layers.filter(([url]) => !leafletLayers[url])
      for (const [url, options] of layersToAdd) {
        const layer = this.createLayer(url, options)
        leafletLayers[url] = layer
        leaflet.addLayer(layer)
      }
    }
    {
      const urlsToRemain = layers.map(([url]) => url)
      const layersToRemove = Object.entries(leafletLayers)
        .filter(([url]) => !urlsToRemain.includes(url))
      for (const [url, layer] of layersToRemove) {
        layer.unbindHandlers()
        leaflet.removeLayer(layer)
      }
    }
  }

  applySight ({ lat, lng, zoom } = {}) {
    const { leaflet } = this
    if (!leaflet) {
      return
    }
    leaflet.setView([lat, lng], zoom)
    this.needsChange()
  }

  componentDidMount () {
    const mapElm = this.mapElmRef.current
    const leaflet = this.leaflet = L.map(mapElm.id, {
      fadeAnimation: false,
    })
    const { lat, layers, lng, onLeaflet, zoom } = this.props
    onLeaflet && onLeaflet(leaflet)
    for (const [event, handler] of Object.entries(this.mapEventHandlers)) {
      leaflet.on(event, handler)
    }
    this.applySight({ lat, lng, zoom })
    this.applyLayers(layers)
  }

  componentDidUpdate (prevProps) {
    const diff = changedProps(prevProps, this.props)
    const needsUpdate = ['leaflet', 'lat', 'lng', 'zoom'].some((k) => k in diff)
    if (needsUpdate) {
      const { lat, lng, zoom } = this.props
      this.applySight({ lat, lng, zoom })
    }
    const needsUpdateLayer = ['leaflet', 'layers'].some((k) => k in diff)
    if (needsUpdateLayer) {
      const { layers } = this.props
      this.applyLayers(layers)
    }
  }

  componentWillUnmount () {
    const { leaflet } = this
    if (leaflet) {
      for (const [event, handler] of Object.entries(this.mapEventHandlers)) {
        leaflet.off(event, handler)
      }
      leaflet.remove()
      this.leaflet = null
    }
    this.leafletLayers = {}
  }

  createLayer (url, options) {
    const layer = new TileLayer(url, options)
    layer.bindHandlers()
    return layer
  }

  needsChange () {
    const { leaflet } = this
    if (!leaflet) {
      return
    }
    const zoom = leaflet.getZoom()
    const { lat, lng } = leaflet.getCenter()
    const { onChange } = this.props
    onChange && onChange({ lat, lng, zoom })
  }

  render () {
    const { props } = this
    const {
      children,
      className,
      height,
      spinning,
      width,
    } = props
    const style = { ...props.style, height, width }
    return (
      <div {...htmlAttributesFor(props, { except: ['className', 'width', 'height'] })}
           {...eventHandlersFor(props, { except: [] })}
           className={c('the-map', className)}
           style={style}
      >
        <TheSpin className='the-map-spin'
                 cover
                 enabled={spinning}
        />
        <div className='the-map-map'
             id={this.mapElmId}
             ref={this.mapElmRef}
             style={style}
        >
          {children}
        </div>
      </div>
    )
  }
}

TheMap.propTypes = {}

TheMap.defaultProps = {
  height: null,
  layers: [
    ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }]
  ],
  spinning: false,
  width: null,
}

TheMap.displayName = 'TheMap'

export default TheMap
