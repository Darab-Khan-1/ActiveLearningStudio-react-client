/* eslint-disable react/prop-types */
import React from 'react';

const RemoveSmSvg = ({ primaryColor, className = '' }) => (
  <>
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5L5 19" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5L19 19" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
);

export default RemoveSmSvg;
