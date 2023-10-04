import system from "settings/system";

const { title: systemTitle } = system;

export const getPageTitle = (page) => {
  return systemTitle;
};
