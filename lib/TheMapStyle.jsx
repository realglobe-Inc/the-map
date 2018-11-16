'use strict'

import c from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { asStyleData } from 'the-component-util'
import { TheStyle } from 'the-style'

/** Style for TheMap */
const TheMapStyle = ({ className, id, options }) => (
  [
    <TheStyle {...{ id }}
              className={c('the-map-style', className)}
              key='base'
              styles={TheMapStyle.data(options)}
    />,
    ...TheMapStyle.externals.map((src) => (
      <link className={c('the-map-style-external')}
            href={src}
            key={src}
            rel='stylesheet'
      />
    ))
  ]
)

TheMapStyle.displayName = 'TheMapStyle'
TheMapStyle.propTypes = {
  /** Style options */
  options: PropTypes.object,
}

TheMapStyle.defaultProps = {
  options: {},
}

TheMapStyle.externals = [
  'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css',
]

TheMapStyle.data = (options) => {
  const { ThemeValues } = TheStyle
  const {
    dominantColor = ThemeValues.dominantColor,
  } = options
  return asStyleData({
    '.the-map': {
      display: 'block',
      position: 'relative',
    },
    '.the-map-map': {
      display: 'block',
      height: '150px',
      width: '100%',
    },
    '.the-map-tile': {},
    '.the-map-tile-loading': {
      '.the-map-title-loading-msg': { display: 'flex' },
    },
    '.the-map-title-loading-msg': {
      alignItem: 'center',
      bottom: 0,
      display: 'none',
      justifyContent: 'center',
      left: 0,
      opacity: 0.2,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      textAlign: 'center',
      top: 0,
      zIndex: 1,
    },
  })
}

export default TheMapStyle
