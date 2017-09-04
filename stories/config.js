/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import {configure} from '@storybook/react'
import React from 'react'
import {storiesOf} from '@storybook/react'

import Basic from './examples/basic'
import Form from './examples/form'
import Controlled from './examples/controlled'
import Multiple from './examples/multiple'
import Autosuggest from './examples/react-autosuggest'
import SemanticUI from './examples/semantic-ui'
import Apollo from './examples/apollo'
import Axios from './examples/axios'
import InstantSearch from './examples/react-instantsearch'
import Popper from './examples/react-popper'
import ReactVirtualized from './examples/windowing-with-react-virtualized'
import ReactTinyVirtualList from './examples/windowing-with-react-tiny-virtual-list'

function loadStories() {
  // clear the console to make debugging experience better
  console.clear()

  storiesOf('Examples', module)
    .add('basic', () => <Basic />)
    .add('form', () => <Form />)
    .add('controlled', () => <Controlled />)
    .add('multiple', () => <Multiple />)
    .add('autosuggest', () => <Autosuggest />)
    .add('semantic-ui', () => <SemanticUI />)
    .add('apollo', () => <Apollo />)
    .add('axios', () => <Axios />)
    .add('instant search', () => <InstantSearch />)
    .add('react-popper', () => <Popper />)
    .add('windowing with react-virtualized', () => <ReactVirtualized />)
    .add('windowing with react-tiny-virtual-list', () =>
      <ReactTinyVirtualList />,
    )
}

configure(loadStories, module)
