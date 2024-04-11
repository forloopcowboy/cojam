import React, { ElementType } from 'react';

/** Useful type definition that allows a component to customize an underlying element and receive props for said element. */
export type GenericComponentProps<E extends ElementType> = {
  as?: E;
} & React.ComponentPropsWithoutRef<E>;
