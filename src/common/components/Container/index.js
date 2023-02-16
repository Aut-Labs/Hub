import React from 'react';
import ContainerWrapper from './style';

const Container = ({
  children,
  className,
  fullWidth,
  noGutter,
  width,
  ...props
}) => {
  // Add all classs to an array
  const addAllClasses = ['container'];
  // className prop checking
  if (className) {
    addAllClasses.push(className);
  }

  return (
    <ContainerWrapper
      className={addAllClasses.join(' ')}
      fullWidth={fullWidth}
      noGutter={noGutter}
      width={width}
      {...props}
    >
      {children}
    </ContainerWrapper>
  );
};

export default Container;
