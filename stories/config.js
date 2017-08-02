/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import {configure} from '@storybook/react'
import React from 'react'
import {storiesOf} from '@storybook/react'

import Basic from './examples/basic'
import SemanticUI from './examples/semantic-ui'
import Apollo from './examples/apollo'
import Axios from './examples/axios'
import InstantSearch from './examples/react-instantsearch'
import Popper from './examples/react-popper'

function loadStories() {
  // clear the console to make debugging experience better
  console.clear()

  storiesOf('Examples', module)
    .add('basic', () => <Basic />)
    .add('semantic-ui', () => <SemanticUI />)
    .add('apollo', () => <Apollo />)
    .add('axios', () => <Axios />)
    .add('instant search', () => <InstantSearch />)
    .add('react-popper', () => <Popper />)
}

configure(loadStories, module)
