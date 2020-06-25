import PageComponent from './PageComponent';
import React from 'react';

export const ComponentComponents = {
  page: PageComponent
};

export const ComponentDataTypes = {
  page: {
    name: "page",
    icon: "document",
    friendlyName: "Page"
  }
};

export const FindComponentComponent = (id, type, planet) => {
  const Component = ComponentComponents[type];
  return <Component id={id} planet={planet}/>;
};