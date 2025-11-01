import React from 'react';
import { Helmet } from 'react-helmet';

const Favicon = ({ url }) => {
  return (
    <Helmet>
      <link rel="icon" href={url} />
    </Helmet>
  );
};

export default Favicon;
