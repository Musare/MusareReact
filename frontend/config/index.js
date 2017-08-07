import templateConfig from "./template";
import defaultConfig from "./default";

function replaceObject(toReplace, toReplaceWith) {
	const toReplaceObj = toReplace;
	Object.keys(toReplaceWith).forEach((key) => {
		const value = toReplaceWith[key];
		if (!value) return;
		if (typeof value === "object") {
			toReplaceObj[key] = replaceObject(toReplace[key], toReplaceWith[key]);
		} else {
			toReplaceObj[key] = value;
		}
	});
	return toReplaceObj;
}

export default replaceObject(templateConfig, defaultConfig);
