import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveView, ResponsiveContextConsumer } from './ResponsiveView'

import addons, { makeDecorator } from '@storybook/addons'

export class Decorator extends Component {
  static propTypes = {
    channel: PropTypes.shape({
      emit: PropTypes.func,
      on: PropTypes.func,
      removeListener: PropTypes.func,
    }),
    story: PropTypes.func.isRequired,
    breakpoints: PropTypes.objectOf(PropTypes.number),
  }

  static defaultProps = {
    channel: undefined,
    breakpoints: {
      tablet: 768,
      desktop: 1024,
    },
  }

  constructor(props) {
    super(props)

    const { channel } = props

    if (channel) {
      this.channel = channel
    } else {
      this.channel = addons.getChannel()
    }
  }

  state = {
    enableViews: null,
  }

  componentDidMount() {
    this.channel.emit('responsive-addons/check_status')

    this.channel.on('responsive-addons/enable_views', (isEnabled) => {
      this.setState({ enableViews: isEnabled })
    })
  }

  render() {
    const { story } = this.props
    const { enableViews } = this.state

    switch (enableViews) {
      case true:
        return <ResponsiveView breakpoints={this.props.breakpoints}>{story}</ResponsiveView>
      case false:
        return story
      case null:
        return null
    }
  }
}

export const withResponsiveViews = makeDecorator({
  name: 'withResponsiveViews',
  parameterName: 'responsiveViews',
  // eslint-disable-next-line react/display-name
  wrapper: (getStory, context, { options }) => {
    // eslint-disable-line react/display-name
    return <Decorator story={getStory(context)} breakpoints={options} />
  },
})

export const ResponsiveViewContextConsumer = ResponsiveContextConsumer
