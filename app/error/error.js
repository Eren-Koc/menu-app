function Error({ statusCode }) {
    return (
      <div>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </div>
    );
  }
  
  Error.getInitialProps = async ({ res, err }) => {
    const statusCode = res ? res.statusCode : (err ? err.statusCode : 404);
    return { statusCode };
  };
  
  export default Error;