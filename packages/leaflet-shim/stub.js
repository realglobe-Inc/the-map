try {
  module.exports = require('leaflet')
} catch (e) {
  // Failed on server side
  module.exports = {
    TileLayer: function TileLayer () {},
    DivIcon: function DivIcon () {},
  }

}
