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
import { legalPage } from "./legal-page";
import { storiesPage } from "./stories-page";
import { settingsPageIntro } from "./page-intro";

export const schemaTypes = [
  settingsBrand,
  settingsPageIntro,
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
  legalPage,
  storiesPage,
];
