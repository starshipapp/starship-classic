import PageComponent from './PageComponent';
import React from 'react';
import WikiComponent from "./WikiComponent";

export const ComponentComponents = {
  page: PageComponent,
  wiki: WikiComponent
};

export const ComponentDataTypes = {
  page: {
    name: "page",
    icon: "document",
    friendlyName: "Page"
  }, wiki: {
    name: "wiki",
    icon: "applications",
    friendlyName: "Page Group"
  }
};

export const FindComponentComponent = (id, type, planet) => {
  const Component = ComponentComponents[type];
  return <Component id={id} planet={planet}/>;
};