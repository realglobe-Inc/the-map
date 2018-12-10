'use strict'

import c from 'classnames'
import formatcoords from 'formatcoords'
import PropTypes from 'prop-types'
import React from 'react'
import TheMap from './TheMap'

class TheMapPositionInput extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange ({ bounds: { east, north, south, west }, lat, lng, zoom }) {
    const { name, onUpdate } = this.props
    onUpdate({
      [name]: { lat, lng, zoom },
    })
  }

  render () {
    const {
      height,
      layers,
      value,
      width,
    } = this.props
    const { lat, lng, zoom } = value
    console.log('render', lat, lng, zoom)
    return (
      <div className='the-map-position-input'
           style={{ height, width }}
      >
        <TheMap {...{
          height,
          lat,
          layers,
          lng,
          width,
          zoom,
        }}
                layerControlEnabled={false}
                onChange={this.handleChange}
        />
        <input className='the-map-position-input-input'
               type='hidden'
               value={`${lat},${lng}`}
        />
        <div className='the-map-position-input-display'>
          {formatcoords(lat, lng).format('f')}
        </div>
        <div className='the-map-position-input-target'>
          <div className='the-map-position-input-target-dot'/>
          <div className='the-map-position-input-target-bar1'/>
          <div className='the-map-position-input-target-bar2'/>
        </div>
      </div>
    )
  }
}

TheMapPositionInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
}

TheMapPositionInput.defaultProps = {
  height: 150,
  layers: TheMap.defaultProps.layers || [],
  value: { lat: 35.6895, lng: 139.6917, zoom: 13 },
  width: 300,

}

export default TheMapPositionInput
