import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay3 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	callback: state.stationOverlay.get("callback"),
}))
export default class SearchYouTube extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			results: null,
			gotResults: false,
		};

		io.getSocket((socket) => {

		});
	}

	search = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["query"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit('apis.searchYoutube', this.input.query.getValue(), res => {
					if (res.status === "success") {
						let results = res.data.items.map((result) => {
							return {
								songId: result.id.videoId,
								url: `https://www.youtube.com/watch?v=${ result.id.videoId }`,
								title: result.snippet.title,
								thumbnail: result.snippet.thumbnails.default.url,
							};
						});

						this.setState({
							gotResults: true,
							results,
						});
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	close = () => {
		this.props.dispatch(closeOverlay3());
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Search</h1>

				<CustomInput type="youTubeSearchQuery" name="query" label="YouTube search query" placeholder="YouTube search query" onRef={ ref => (this.input.query = ref) } />
				<button onClick={ this.search }>Search</button>

				{
					(this.state.gotResults)
					? (
						<div>
							<h2>Results</h2>
							{
								this.state.results.map((result) => {
									return (
										<li key={ this.input.query.getValue() + result.songId }>
											<img src={ result.thumbnail }/>
											<a href={ result.url }>{ result.title }</a>
											<span>12:12</span>
											<span onClick={ () => { this.props.dispatch(closeOverlay3()); this.props.callback(result.songId) } }>ADD</span>
										</li>
									);
								})
							}
						</div>
					)
					: null
				}
				<ul>
					{}
				</ul>

				<CustomErrors onRef={ ref => (this.messages = ref) } />
			</div>
		);
	}
}
