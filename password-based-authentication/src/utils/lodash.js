import { get as lodashGet } from "lodash";

// Create our own get() wrapper to handle more falsy situations
export const get = (source, path, defaultValue, callback) => {
  let value = lodashGet(source, path, defaultValue);
  // Use the default value for specific falsy values
  if (value === null || value === undefined || value === "") {
    value = defaultValue;
  }
  // If there is a callback passed to process the get value/defaultValue
  if (typeof callback === "function") {
    return callback(value);
  }
  return value;
};
