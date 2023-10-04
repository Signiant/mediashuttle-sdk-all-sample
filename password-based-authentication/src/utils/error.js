import { toast } from "react-toastify";
import { get } from "./lodash";

export const handleError = (error) => {
  const errorMsg = get(error, "message") || get(error, "error");
  if (errorMsg) {
    toast.error(errorMsg);
  }
};
