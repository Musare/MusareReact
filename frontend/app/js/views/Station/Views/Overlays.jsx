import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Settings from "./Settings";
import Playlists from "./Playlists/index.jsx";
import EditPlaylist from "./Playlists/EditPlaylist";
import SearchYouTube from "./SearchYouTube/index.jsx";
import QueueList from "./Queue/index.jsx";

@connect(state => ({
	overlay1: state.stationOverlay.get("overlay1"),
	overlay2: state.stationOverlay.get("overlay2"),
	overlay3: state.stationOverlay.get("overlay3"),
	extraProps2: state.stationOverlay.get("extraProps2"),
}))
export default class Overlays extends Component {
	constructor(props) {
		super(props);

		this.state = {
			overlay1: null,
			overlay2: null,
			overlay3: null,
		};
	}

	getComponent = (type, key) => {
		let input = null;
		if (type === "settings") input = <Settings t={ this.props.t } key={ key }/>;
		else if (type === "playlists") input = <Playlists t={ this.props.t } key={ key }/>;
		else if (type === "editPlaylist") input = <EditPlaylist t={ this.props.t } key={ key } playlistId={ this.props.extraProps2.get("playlistId") }/>;
		else if (type === "searchYouTube") {
			if (this.state.overlay2) input = <SearchYouTube t={ this.props.t } order={ 3 } key={ key }/>;
			else input = <SearchYouTube t={ this.props.t } order={ 2 } key={ key }/>;
		}
		else if (type === "queueList") input = <QueueList t={ this.props.t } key={ key }/>;
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
		if (this.props.overlay3 !== prevProps.overlay3) {
			this.setState({
				overlay3: this.getComponent(this.props.overlay3),
			});
		}
	}

	render() {
		return <div id="overlays">
			{ this.state.overlay1 }
			{ this.state.overlay2 }
			{ this.state.overlay3 }
		</div>;
	}
}
