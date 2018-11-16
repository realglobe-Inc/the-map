/**
 * @class TileBuilder
 */
'use strict'

import L from 'leaflet'
import { get } from 'the-window'

class TileLayer extends L.TileLayer {
  constructor () {
    super(...arguments)

    this.spinning = false
    this.handlers = {}
  }

  bindHandlers () {
    for (const [event, handler] of Object.entries(this.handlers)) {
      this.on(event, handler)
    }
  }

  createTile (coords, done) {
    const document = get('document')
    const tile = document.createElement('div')
    tile.classList.add('the-map-tile')
    tile.classList.add('the-map-tile-loading')
    {
      const image = super.createTile(coords, (err, img) => {
        tile.classList.remove('the-map-tile-loading')
        if (err) {
          tile.classList.add('the-map-tile-failed')
        }
        done(err, tile)
      })
      tile.appendChild(image)
    }
    {
      const loadingMsg = document.createElement('span')
      loadingMsg.classList.add('the-map-title-loading-msg')
      loadingMsg.innerText = 'Loading...'
      tile.appendChild(loadingMsg)
    }
    return tile
  }

  unbindHandlers () {
    for (const [event, handler] of Object.entries(this.handlers)) {
      this.off(event, handler)
    }
  }
}

export default TileLayer
