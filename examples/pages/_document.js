import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {renderStatic} from 'glamor/server'
import {ServerStyleSheet} from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)
    return Promise.resolve({...page, ...styles})
  }

  constructor(props) {
    super(props)
    const {__NEXT_DATA__, ids} = props
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids
    }
  }

  render() {
    const sheet = new ServerStyleSheet()
    const main = sheet.collectStyles(<Main />)
    const styleTags = sheet.getStyleElement()
    return (
      <html lang={this.props.locale}>
        <Head>
          <title>react-autocompletely examples</title>
          <style dangerouslySetInnerHTML={{__html: this.props.css}} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body>
          {main}
          <NextScript />
        </body>
      </html>
    )
  }
}
