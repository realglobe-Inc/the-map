/**
 * Test for DivIcon.
 * Runs with mocha.
 */
'use strict'

import DivIcon from '../lib/classes/DivIcon'
import React from 'react'
import { ok, equal } from 'assert'
import { render } from 'the-script-test'

describe('div-icon', () => {
  before(() => {
  })

  after(() => {
  })

  it('Render a component', () => {
    let element = render(
       <DivIcon />
    )
    ok(element)
  })
})

/* global describe, before, after, it */
