'use strict'

import c from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { ThemeValues } from 'the-component-constants'
import { changedProps, eventHandlersFor, htmlAttributesFor, newId } from 'the-component-util'
import { TheSpin } from 'the-spin'
import L from '@okunishinishi/leaflet-shim'
import DivIcon from './classes/DivIcon'
import TileLayer from './classes/TileLayer'
import TheMapMarker from './TheMapMarker'

/**
 * Geo map for the-components
 */
class TheMap extends React.Component {
  constructor (props) {
    super(props)
    this.map = null
    this.mapLayers = {}
    this.mapMarkers = {}
    this.mapElmRef = React.createRef()
    this.mapLayerControl = null
    this.mapZoomControl = null
    this.mapElmId = newId({ prefix: 'the-map' })
    this.state = {}
    this.mapEventHandlers = {
      click: (e) => {
        const { onClick } = this.props
        const { lat, lng } = e.latlng
        onClick && onClick({ lat, lng })
      },
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

  applyCall (prevProps, actions) {
    const diff = changedProps(prevProps, this.props)
    for (const [target, action] of Object.entries(actions)) {
      const needsUpdate = target.split(',').some((k) => k in diff)
      if (needsUpdate) {
        action(this.props)
      }
    }
  }

  applyLayerControl (layerControlEnabled) {
    const { map, mapLayers } = this
    if (!map) {
      return
    }
    if (!layerControlEnabled) {
      if (this.mapLayerControl) {
        this.mapLayerControl.remove()
        this.mapLayerControl = null
      }
      return
    }
    const { layerControlPosition } = this.props
    const mapLayerControl = this.mapLayerControl = L.control.layers(
      Object.assign(
        {},
        ...Object.values(mapLayers).map((layer) => ({
          [layer.title]: layer,
        }))
      ),
      {},
      { position: layerControlPosition }
    )
    mapLayerControl.addTo(map)
  }

  applyLayers (layers) {
    const { map, mapLayers } = this
    if (!map) {
      return
    }
    {
      const layerValuesToAdd = layers.filter(({ key }) => !mapLayers[key])
      for (const { key, url, ...options } of layerValuesToAdd) {
        const layer = this.createLayer(url, options)
        mapLayers[key] = layer
        map.addLayer(layer)
      }
    }
    {
      const keysToRemain = layers.map(({ key }) => key)
      const layerEntriesToRemove = Object.entries(mapLayers)
        .filter(([key]) => !keysToRemain.includes(key))
      for (const [key, layer] of layerEntriesToRemove) {
        layer.unbindHandlers()
        map.removeLayer(layer)
        delete mapLayers[key]
      }
    }
    if (this.mapLayerControl) {
      this.mapLayerControl.remove()
    }
  }

  applyMarkers (markers) {
    const { map, mapMarkers } = this
    if (!map) {
      return
    }
    {
      const markerValuesToAdd = markers.filter(({ key }) => !mapMarkers[key])
      for (const { key, ...options } of markerValuesToAdd) {
        const marker = this.createMarker(map, options)
        mapMarkers[key] = marker
      }
    }
    {
      const keysTORemain = markers.map(({ key }) => key)
      const markerEntriesToRemove = Object.entries(mapMarkers)
        .filter(([key]) => !keysTORemain.includes(key))
      for (const [key, marker] of markerEntriesToRemove) {
        marker.remove()
      }
    }
  }

  applySight ({ lat, lng, zoom } = {}) {
    const { map } = this
    if (!map) {
      return
    }
    map.setView([lat, lng], zoom)
    this.needsChange()
  }

  applyZoomControl (zoomControlEnabled) {
    const { map } = this
    if (!map) {
      return
    }
    if (!zoomControlEnabled) {
      if (this.mapZoomControl) {
        this.mapZoomControl.remove()
        this.mapZoomControl = null
      }
      return
    }
    const { zoomControlPosition } = this.props
    const mapZoomControl = this.mapZoomControl = L.control.zoom({
      position: zoomControlPosition,
    })
    mapZoomControl.addTo(map)
  }

  componentDidMount () {
    const mapElm = this.mapElmRef.current
    const map = this.map = L.map(mapElm.id, {
      fadeAnimation: false,
      zoomControl: false,
    })
    const {
      lat,
      layerControlEnabled,
      layers,
      lng,
      markers,
      onLeafletMap,
      zoom,
      zoomControlEnabled,
    } = this.props
    onLeafletMap && onLeafletMap(map)
    for (const [event, handler] of Object.entries(this.mapEventHandlers)) {
      map.on(event, handler)
    }
    this.applySight({ lat, lng, zoom })
    this.applyLayers(layers)
    this.applyLayerControl(layerControlEnabled)
    this.applyZoomControl(zoomControlEnabled)
    this.applyMarkers(markers)
  }

  componentDidUpdate (prevProps) {
    const diff = changedProps(prevProps, this.props)
    this.applyCall(prevProps, {
      'map,lat,lng,zoom': ({ lat, lng, zoom }) => this.applySight({ lat, lng, zoom }),
      'map,layerControlEnabled': ({ layerControlEnabled }) => this.applyLayerControl(layerControlEnabled),
      'map,layers': ({ layers }) => this.applyLayers(layers),
      'map,markers': ({ markers }) => this.applyMarkers(markers),
      'map,zoomControlEnabled': ({ zoomControlEnabled }) => this.applyZoomControl(zoomControlEnabled),
    })
    const needsUpdateLayerControl = ['map', 'layerControlEnabled'].some((k) => k in diff)
    if (needsUpdateLayerControl) {
    }
  }

  componentWillUnmount () {
    const { map } = this
    if (map) {
      for (const [event, handler] of Object.entries(this.mapEventHandlers)) {
        map.off(event, handler)
      }
      map.remove()
      this.map = null
    }
    this.mapLayers = {}
  }

  createLayer (url, { title, ...options } = {}) {
    const layer = new TileLayer(url, options)
    layer.title = title
    layer.bindHandlers()
    return layer
  }

  createMarker (map, options = {}) {
    const {
      draggable = false,
      height = ThemeValues.tappableHeight,
      lat,
      lng,
      node,
      onClick,
      riseOnHover = true,
      width = ThemeValues.tappableHeight,
    } = options
    const marker = L.marker([lat, lng], {
      draggable,
      icon: new DivIcon({
        className: 'the-map-marker-div-icon',
        iconSize: L.point(width, height),
      }),
      riseOnHover,
    })
    marker.addTo(map)
    marker.node = (
      <TheMapMarker container={marker.getElement()}
                    onClick={onClick}
                    style={{ height, width }}
      >
        {node || null}
      </TheMapMarker>
    )
    return marker
  }

  needsChange () {
    const { map } = this
    if (!map) {
      return
    }
    const zoom = map.getZoom()
    const { lat, lng } = map.getCenter()
    const bounds = map.getBounds()
    const { onChange } = this.props
    onChange && onChange({
      bounds: {
        east: bounds.getEast(),
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
      },
      lat,
      lng,
      zoom,
    })
  }

  render () {
    const { mapMarkers, props } = this
    const {
      children,
      className,
      freezed,
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
        <div className={c('the-map-map', {
          'the-map-map-freezed': freezed,
        })}
             id={this.mapElmId}
             ref={this.mapElmRef}
             style={style}
        >
          {children}
        </div>
        {
          Object.entries(mapMarkers).map(([k, marker]) => (
            <React.Fragment key={k}>
              {marker.node || null}
            </React.Fragment>
          ))
        }
      </div>
    )
  }
}

TheMap.propTypes = {
  /** Disable all interactions */
  freezed: PropTypes.bool,
  /** Height of map */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** latitude value */
  lat: PropTypes.number.isRequired,
  /** longitude value */
  lng: PropTypes.number.isRequired,
  /** Callback when map map created */
  onLeafletMap: PropTypes.func,
  /** Shows spinner */
  spinning: PropTypes.bool,
  /** Width of map */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

TheMap.defaultProps = {
  freezed: false,
  height: null,
  layerControlEnabled: true,
  layerControlPosition: 'topright',
  layers: [
    {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      key: 'default',
      maxZoom: 19,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  ],
  onLeafletMap: null,
  spinning: false,
  width: null,
  zoomControlEnabled: true,
  zoomControlPosition: 'topleft',
}

TheMap.displayName = 'TheMap'

export default TheMap
