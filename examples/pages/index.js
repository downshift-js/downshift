import React from 'react'
import Link from 'next/link'
import preval from 'preval.macro'

const routes = preval`
  const fs = require('fs')
  const path = require('path')

  module.exports = fs.readdirSync(__dirname)
    .filter(file => {
      return fs
        .lstatSync(path.join(__dirname, file))
        .isDirectory()
    })
`

export default Index

function Index() {
  return (
    <div>
      See the examples:
      <ul>
        {routes.map(route =>
          (<li key={route}>
            <Link href={`/${route}`}>
              <a>
                {route}
              </a>
            </Link>
          </li>),
        )}
      </ul>
    </div>
  )
}
