import { memo as reactMemo } from "react";
import isEqual from "lodash/isEqual";

// Memo function
// - to reduce component rerender time
// Compare previous state & new state
export const memo = (Component) => reactMemo(Component, isEqual);
