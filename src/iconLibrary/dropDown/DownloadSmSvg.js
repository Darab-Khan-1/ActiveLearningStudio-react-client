/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';

const DownloadSmSvg = ({ primaryColor, className = '' }) => (
  <>
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 9V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V9"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.66699 5.66602L7.00033 8.99935L10.3337 5.66602" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9V1" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
);

export default DownloadSmSvg;