import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	stationId: state.station.get("id"),
	name: state.station.get("name"),
	displayName: state.station.get("displayName"),
	description: state.station.get("description"),
	privacy: state.station.get("privacy"),
}))
export default class Settings extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			privacy: props.privacy,
		};
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	changeName = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["name"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("stations.updateName", this.props.stationId, this.input.name.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed name.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	changeDisplayName = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["displayName"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("stations.updateDisplayName", this.props.stationId, this.input.displayName.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed display name.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	changeDescription = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["description"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("stations.updateDescription", this.props.stationId, this.input.description.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed description.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	savePrivacy = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["privacy"])) {
			console.log(this.props);
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("stations.updatePrivacy", this.props.stationId, this.input.privacy.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully saved privacy.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	deleteStation = () => {
		io.getSocket(socket => {
			socket.emit('stations.remove', this.props.stationId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully deleted station.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Settings</h1>
				<CustomErrors onRef={ ref => (this.messages = ref) } />

				<CustomInput key="name" type="stationName" name="name" label="Station name" placeholder="Station name" original={ this.props.name } onRef={ ref => (this.input.name = ref) } />
				<button onClick={ this.changeName }>Change name</button>

				<CustomInput key="displayName" type="stationDisplayName" name="displayName" label="Station display name" placeholder="Station display name" original={ this.props.displayName } onRef={ ref => (this.input.displayName = ref) } />
				<button onClick={ this.changeDisplayName }>Change display name</button>

				<CustomInput key="description" type="stationDescription" name="description" label="Station description" placeholder="Station description" original={ this.props.description } onRef={ ref => (this.input.description = ref) } />
				<button onClick={ this.changeDescription }>Change description</button>

				<CustomInput key="privacy" type="stationPrivacy" name="privacy" label="Station privacy" placeholder="Station privacy" original={ this.state.privacy } onRef={ ref => (this.input.privacy = ref) } />
				<button onClick={ this.savePrivacy }>Save privacy</button>

				<button onClick={ this.deleteStation }>Delete station</button>
			</div>
		);
	}
}
