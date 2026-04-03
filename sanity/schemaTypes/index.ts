import {
  settingsBrand,
  settingsContact,
  settingsHours,
  socialLink,
  settingsSeo,
} from "./site-settings";
import { navigationHeader, navigationFooter } from "./navigation";
import { page } from "./page";
import { menuPage } from "./menu-page";
import { menuCategory } from "./menu-category";
import { menuItem } from "./menu-item";
import { allergen } from "./allergen";
import { post } from "./post";
import { author } from "./author";

export const schemaTypes = [
  settingsBrand,
  settingsContact,
  settingsHours,
  socialLink,
  settingsSeo,
  navigationHeader,
  navigationFooter,
  page,
  menuPage,
  menuCategory,
  menuItem,
  allergen,
  post,
  author,
];
