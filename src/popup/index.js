import React from 'react'
import { render } from 'react-dom'
import Container from './container'

const root = document.createElement('div')
document.body.appendChild(root)
render(<Container />, root)
