'use strict'

import c from 'classnames'
import L from 'leaflet'
import PropTypes from 'prop-types'
import React from 'react'
import { eventHandlersFor, htmlAttributesFor, newId } from 'the-component-util'

/**
 * Geo map for the-components
 */
class TheMap extends React.Component {
  constructor (props) {
    super(props)
    this.leaflet = null
    this.mapElmRef = React.createRef()
    this.mapElmId = newId({ prefix: 'the-map' })
  }

  componentDidMount () {
    const mapElm = this.mapElmRef.current
    const leaflet = this.leaflet = L.map(mapElm.id)
    const { onLeaflet } = this.props
    onLeaflet && onLeaflet(leaflet)
  }

  componentWillUnmount () {
    if (this.leaflet) {
      this.leaflet.remove()
    }
  }

  render () {
    const { props } = this
    const {
      children,
      className,
    } = props
    return (
      <div {...htmlAttributesFor(props, { except: ['className'] })}
           {...eventHandlersFor(props, { except: [] })}
           className={c('the-map', className)}
      >
        <div className='the-map-map'
             id={this.mapElmId}
             ref={this.mapElmRef}
        >
          {children}
        </div>
      </div>
    )
  }
}

TheMap.propTypes = {}

TheMap.defaultProps = {}

TheMap.displayName = 'TheMap'

export default TheMap
