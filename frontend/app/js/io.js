const callbacks = {
	general: {
		general: [],
		persist: [],
	},
	connect: {
		general: [],
		persist: [],
		error: {
			general: [],
			persist: [],
		},
	},
	disconnect: {
		general: [],
		persist: [],
	},
};

export default {

	ready: false,
	socket: null,

	getSocket(...args) {
		if (args[0] === true) {
			if (this.ready) args[1](this.socket);
			else callbacks.general.persist.push(args[1]);
		} else if (this.ready) {
			args[0](this.socket);
		} else {
			callbacks.general.general.push(args[0]);
		}
	},

	onConnect(...args) {
		if (args[0] === true) callbacks.connect.persist.push(args[1]);
		else callbacks.connect.general.push(args[0]);
	},

	onDisconnect(...args) {
		if (args[0] === true) callbacks.disconnect.persist.push(args[1]);
		else callbacks.disconnect.general.push(args[0]);
	},

	onConnectError(...args) {
		if (args[0] === true) callbacks.connect.error.persist.push(args[1]);
		else callbacks.connect.error.general.push(args[0]);
	},

	clear() {
		callbacks.general.general = [];
		callbacks.connect.general = [];
		callbacks.disconnect.general = [];
		callbacks.connect.error.general = [];
	},

	removeAllListeners() {
		Object.keys(this.socket._callbacks).forEach(id => {
			if (id.indexOf("$event:") !== -1 && id.indexOf("$event:keep.") === -1) delete this.socket._callbacks[id];
		});
	},

	init(url) {
		this.socket = window.socket = io(url);

		this.socket.on("connect", () => {
			callbacks.connect.general.forEach(callback => callback());
			callbacks.connect.persist.forEach(callback => callback());
		});

		this.socket.on("disconnect", () => {
			callbacks.disconnect.general.forEach(callback => callback());
			callbacks.disconnect.persist.forEach(callback => callback());
		});

		this.socket.on("connect_error", () => {
			callbacks.connect.error.general.forEach(callback => callback());
			callbacks.connect.error.persist.forEach(callback => callback());
		});

		this.ready = true;

		callbacks.general.general.forEach(callback => callback(this.socket));
		callbacks.general.persist.forEach(callback => callback(this.socket));

		callbacks.general = { general: [], persist: [] };
	},
};
