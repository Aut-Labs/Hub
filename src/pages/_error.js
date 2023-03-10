import React, { Fragment } from 'react';
import Head from 'next/head';
import ResetCSS from 'common/assets/css/style';
export default function Error({ statusCode }) {
  return (
    <Fragment>
      <Head>
        <title>404: Not found</title>
      </Head>
      <ResetCSS />
      {/* <div>
        {statusCode ? (
          `An error ${statusCode} occurred on server`
        ) : (
          <ErrorSec />
        )}
      </div> */}
    </Fragment>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
