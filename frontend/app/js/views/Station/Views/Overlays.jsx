import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Settings from "./Settings";
import Playlists from "./Playlists";
import EditPlaylist from "./EditPlaylist";

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
		let input = null;
		if (type === "settings") input = <Settings t={ this.props.t } key={ key }/>;
		else if (type === "playlists") input = <Playlists t={ this.props.t } key={ key }/>;
		else if (type === "editPlaylist") input = <EditPlaylist t={ this.props.t } key={ key }/>;
		return input;
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.props.overlay1 !== prevProps.overlay1) {
			this.setState({
				overlay1: this.getComponent(this.props.overlay1),
			});
		}
		if (this.props.overlay2 !== prevProps.overlay2) {
			this.setState({
				overlay2: this.getComponent(this.props.overlay2),
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
