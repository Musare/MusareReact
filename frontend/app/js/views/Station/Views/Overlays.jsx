import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Settings from "./Settings";

@connect(state => ({
	overlay1: state.stationOverlay.get("overlay1"),
	overlay2: state.stationOverlay.get("overlay2"),
}))
export default class Overlays extends Component {
	constructor(props) {
		super(props);

		this.state = {
			overlay1: null,
			overlay2: null,
		};
	}

	getComponent = (type, key) => {
		if (type === "settings") {
			return <Settings key={ key }/>;
		} else return null;
	};

	componentDidUpdate(prevProps, prevState) {
		console.log(111, prevProps.overlay1, this.props.overlay1);
		if (this.props.overlay1 !== prevProps.overlay1) {
			this.setState({
				overlay1: this.getComponent(this.props.overlay1),
			});
		}
	}

	render() {
		return <div>
			{ this.state.overlay1 }
			{ this.state.overlay2 }
		</div>;
	}
}
