import PageComponent from "./PageComponent";
import React from "react";
import WikiComponent from "./WikiComponent";
import FilesComponent from "./FilesComponent";
import ForumComponent from "./ForumComponent";
import ForumAdmin from "../admin/settings/ForumAdmin";

export const ComponentComponents = {
  page: PageComponent,
  wiki: WikiComponent,
  files: FilesComponent,
  forum: ForumComponent
};

export const ComponentDataTypes = {
  page: {
    name: "page",
    icon: "document",
    friendlyName: "Page"
  },
  wiki: {
    name: "wiki",
    icon: "applications",
    friendlyName: "Page Group"
  },
  files: {
    name: "files",
    icon: "folder-open",
    friendlyName: "Files"
  },
  forum: {
    name: "forum",
    icon: "comment",
    friendlyName: "Forum"//,
    //settingsComponent: ForumAdmin
  }
};

export const FindSettingsComponent = (id, type, planet) => {
  const Component = ComponentDataTypes[type].settingsComponent;
  return <Component id={id} planet={planet} name={name}/>;
};

export const FindComponentComponent = (id, type, planet, name, subId) => {
  const Component = ComponentComponents[type];
  return <Component id={id} planet={planet} name={name} subId={subId}/>;
};