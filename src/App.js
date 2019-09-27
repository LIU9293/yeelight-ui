import React, { useState, useEffect } from 'react'
import { Icon, Slider, notification } from 'antd'

const marks = {
  0: '0',
  100: '100'
}

function App () {
  const [lights, setLights] = useState([])

  useEffect(() => {
    async function getLights () {
      const res = await fetch('http://192.168.2.135:3344/lights')
      const lights = await res.json()
      setLights(lights)
    }

    getLights()
  }, [])

  function toggle (id) {
    fetch(`http://192.168.2.135:3344/toggle/${id}`)
      .then(res => res.json())
      .then(info => {
        const newLights = lights.map(item => {
          if (item.id === id) {
            return info
          }
          return item
        })
        setLights(newLights)
      })
      .catch(err => {
        notification.error({
          message: 'Error',
          description: err.message
        })
      })
  }

  function onBrightChange (id, value) {
    fetch(`http://192.168.2.135:3344/bright/${id}?bright=${value}`)
      .then(res => res.json())
      .then(info => {
        const newLights = lights.map(item => {
          if (item.id === id) {
            return info
          }
          return item
        })
        setLights(newLights)
      })
      .catch(err => {
        notification.error({
          message: 'Error',
          description: err.message
        })
      })
  }

  return (
    <div className='App'>
      {
        lights.map(light => {
          return (
            <div key={light.id} className='section'>
              <div className='row'>
                <Icon
                  type='bulb'
                  theme={light.on ? 'filled' : 'outlined'}
                  style={{ marginRight: 10, fontSize: 30, color: light.on ? '#ffd43b' : '#ced4da', cursor: 'pointer' }}
                  onClick={() => toggle(light.id)}
                />
                <div style={{ fontSize: 22 }}>{light.name}</div>
              </div>
              <div className='slider'>
                <Slider
                  defaultValue={parseInt(light.bright)}
                  marks={marks}
                  step={1}
                  onAfterChange={value => onBrightChange(light.id, value)}
                />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default App
