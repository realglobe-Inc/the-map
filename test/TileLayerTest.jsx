/**
 * Test for TileLayer.
 * Runs with mocha.
 */
'use strict'

import TileLayer from '../lib/classes/TileLayer'
import React from 'react'
import { ok, equal } from 'assert'
import { render } from 'the-script-test'

describe('tile-layer', () => {
  before(() => {
  })

  after(() => {
  })

  it('Render a component', () => {
    let element = render(
       <TileLayer />
    )
    ok(element)
  })
})

/* global describe, before, after, it */
