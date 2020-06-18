import PageComponent from './PageComponent';
import React from 'react';

export const ComponentComponents = {
  page: PageComponent
}

export const FindComponentComponent = (id, type, planet) => {
  const Component = ComponentComponents[type]
  return <Component id={id} planet={planet}/>
}