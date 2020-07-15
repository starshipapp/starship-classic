import PageComponent from "./PageComponent";
import React from "react";
import WikiComponent from "./WikiComponent";
import FilesComponent from "./FilesComponent";

export const ComponentComponents = {
  page: PageComponent,
  wiki: WikiComponent,
  files: FilesComponent
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
  }
};

export const FindComponentComponent = (id, type, planet, name, subId) => {
  const Component = ComponentComponents[type];
  return <Component id={id} planet={planet} name={name} subId={subId}/>;
};