import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	stationId: state.station.info.get("stationId"),
	name: state.station.info.get("name"),
	displayName: state.station.info.get("displayName"),
	description: state.station.info.get("description"),
	privacy: state.station.info.get("privacy"),
	mode: state.station.info.get("mode"),
	//partyEnabled: state.station.get("partyMode"),
	//queueLocked: state.station.get("locked"),
}))
export default class Settings extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			//privacy: props.privacy,
			//mode: this.getModeTemp(props.partyEnabled, props.queueLocked),
			deleteButtonText: "Delete this station", //TODO Improve this
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

	/*getModeTemp = (partyEnabled, queueLocked) => {
		// If party enabled
			// If queue locked
				// Mode is DJ
			// If queue not locked
				// Mode party
		// If party not enabled
			// Mode is normal

		if (partyEnabled) {
			if (queueLocked) return "dj";
			else return "party";
		} else return "normal";
	}*/

	translateModeTemp = (mode) => {
		// If party enabled
			// If queue locked
				// Mode is DJ
			// If queue not locked
				// Mode party
		// If party not enabled
			// Mode is normal

		if (mode === "normal") {
			return {
				partyMode: false,
				queueLocked: true,
			};
		} else if (mode === "dj") {
			return {
				partyMode: true,
				queueLocked: true,
			};
		} else if (mode === "party") {
			return {
				partyMode: true,
				queueLocked: false,
			};
		}
	}

	// This is temporary since the backend cannot be changed in this update.
	changeModeHandlerTemp = (newMode, cb) => {
		const previousMode = this.props.mode;

		const disablePartyMode = (cb) => {
			io.getSocket((socket) => {
				socket.emit("stations.updatePartyMode", this.props.stationId, false, (res) => {
					if (res.status === "success") {
						cb();
					} else {
						cb(res.message);
					}
				});
			});
		}

		const enablePartyMode = (cb) => {
			io.getSocket((socket) => {
				socket.emit("stations.updatePartyMode", this.props.stationId, true, (res) => {
					if (res.status === "success") {
						cb();
					} else {
						cb(res.message);
					}
				});
			});
		}

		const disableQueueLock = (cb) => {
			io.getSocket((socket) => {
				socket.emit("stations.toggleLock", this.props.stationId, (res) => {
					if (res.status === "success") {
						if (res.data === false) {
							cb();
						} else {
							disableQueueLock(cb);
						}
					} else {
						cb(res.message);
					}
				});
			});
		}

		const enableQueueLock = (cb) => {
			io.getSocket((socket) => {
				socket.emit("stations.toggleLock", this.props.stationId, (res) => {
					if (res.status === "success") {
						if (res.data === true) {
							cb();
						} else {
							enableQueueLock(cb);
						}
					} else {
						cb(res.message);
					}
				});
			});
		}

		// Previous mode is "normal"
			// New mode is "party"
				// Enable party mode
			// New mode is DJ
				// Enable party mode
				// Enable queue lock
		// Previous mode is "party"
			// New mode is normal
				// Disable party
				// Disable queue lock
			// New mode is DJ
				// Enable queue lock
		// Previous mode is "DJ"
			// New mode is normal
				// Disable party mode
				// Disable queue lock
			// New mode is party
				// Disable queue lock

		if (previousMode === "normal") {
			if (newMode === "party") {
				enablePartyMode(cb);
			} else if (newMode === "dj") {
				enablePartyMode((err) => {
					if (err) return cb(err);
					else enableQueueLock(cb);
				});
			}
		} else if (previousMode === "party") {
			if (newMode === "normal") {
				disablePartyMode((err) => {
					if (err) return cb(err);
					else disableQueueLock(cb);
				});
			} else if (newMode === "dj") {
				enableQueueLock(cb);
			}
		} else if (previousMode === "dj") {
			if (newMode === "normal") {
				disablePartyMode((err) => {
					if (err) return cb(err);
					else disableQueueLock(cb);
				});
			} else if (newMode === "party") {
				disableQueueLock(cb);
			}
		}
	};

	saveMode = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["mode"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			const mode = this.input.mode.getValue();
			this.changeModeHandlerTemp(mode, (err) => {
				if (err) {
					this.messages.addError(err);
				} else {
					this.messages.clearAddSuccess("Successfully saved mode.");
					this.setState({
						mode,
					});
				}
			});
		}
	};

	deleteStation = () => {
		if (this.state.deleteButtonText === "Are you sure?") {
			clearTimeout(this.state.deleteButtonTimeout);
			io.getSocket(socket => {
				socket.emit('stations.remove', this.props.stationId, res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully deleted station.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		} else {
			this.setState({
				deleteButtonText: "Are you sure?",
				deleteButtonTimeout: setTimeout(() => {
					this.setState({
						deleteButtonText: "Delete this station",
						deleteButtonTimeout: null,
					});
				}, 10000),
			});
		}
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close } className="back"><i className="material-icons">arrow_back</i></button>
				<div className="content">
					<h1>Settings</h1>
					<CustomErrors onRef={ ref => (this.messages = ref) } />

					<CustomInput key="name" showLabel={true} type="stationName" name="name" label="Station name" placeholder="Station name" original={ this.props.name } onRef={ ref => (this.input.name = ref) } />
					<button onClick={ this.changeName }>Change name</button>

					<CustomInput key="displayName" showLabel={true} type="stationDisplayName" name="displayName" label="Station display name" placeholder="Station display name" original={ this.props.displayName } onRef={ ref => (this.input.displayName = ref) } />
					<button onClick={ this.changeDisplayName }>Change display name</button>

					<CustomInput key="description" showLabel={true} type="stationDescription" name="description" label="Station description" placeholder="Station description" original={ this.props.description } onRef={ ref => (this.input.description = ref) } />
					<button onClick={ this.changeDescription }>Change description</button>

					<CustomInput key="privacy" showLabel={true} type="stationPrivacy" name="privacy" label="Station privacy" placeholder="Station privacy" original={ this.props.privacy } onRef={ ref => (this.input.privacy = ref) } />
					<button onClick={ this.savePrivacy }>Save privacy</button>

					<CustomInput key="mode" showLabel={true} type="stationMode" name="mode" label="Station mode" placeholder="Station mode" original={ this.props.mode } onRef={ ref => (this.input.mode = ref) } />
					<button onClick={ this.saveMode }>Save mode</button>

					<button onClick={ this.deleteStation } className="red-button">{ this.state.deleteButtonText }</button>
				</div>
			</div>
		);
	}
}
