/**
 * Test for TheMap.
 * Runs with mocha.
 */
'use strict'

import TheMap from '../lib/TheMap'
import React from 'react'
import { ok, equal } from 'assert'
import { render } from 'the-script-test'

describe('the-map', () => {
  before(() => {
  })

  after(() => {
  })

  it('Render a component', () => {
    let element = render(
       <TheMap />
    )
    ok(element)
  })
})

/* global describe, before, after, it */
