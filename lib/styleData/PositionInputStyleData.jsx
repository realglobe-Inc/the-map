'use strict'

import { asStyleData, colorAlpha } from 'the-component-util'

function PositionInputStyleData ({
                                   dominantColor,
                                   targetSize = 64,
                                 }) {
  let zIndex = 999
  return asStyleData({
    '.the-map-position-input': {
      overflow: 'hidden',
      position: 'relative',
    },
    '.the-map-position-input-display': {
      bottom: '16px',
      color: 'white',
      display: 'block',
      fontSize: 'small',
      fontStyle: 'italic',
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      zIndex: zIndex + 2,
    },
    '.the-map-position-input-input': {
      display: 'none',
    },
    '.the-map-position-input-target': {
      alignItems: 'center',
      background: 'transparent',
      border: `4px solid ${dominantColor}`,
      borderRadius: '50%',
      boxShadow: `0 0 0 9999px ${colorAlpha(dominantColor, 0.8)}`,
      display: 'flex',
      height: targetSize,
      justifyContent: 'center',
      left: `calc( 50% - ${targetSize / 2}px )`,
      pointerEvents: 'none',
      position: 'absolute',
      top: `calc( 50% - ${targetSize / 2}px )`,
      width: targetSize,
      zIndex,
    },
    '.the-map-position-input-target-bar1': {},
    '.the-map-position-input-target-bar2': {},
    '.the-map-position-input-target-dot': {
      background: colorAlpha(dominantColor, 0.5),
      border: `1px solid ${dominantColor}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      display: 'block',
      height: '8px',
      width: '8px',
    },
    '.the-map-position-input-values': {
      display: 'flex',
      flexWrap: 'wrap',
    },
  })
}

export default PositionInputStyleData
