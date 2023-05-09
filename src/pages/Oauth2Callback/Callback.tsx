import AutLoading from "@components/AutLoading";
import { useEffect, useState } from "react";

const queryToObject = (query) => {
  const parameters = new URLSearchParams(query);
  return Object.fromEntries(parameters.entries());
};

const Callback = () => {
  useEffect(() => {
    const payload = queryToObject(window.location.search.split("?")[1]);
    const error = payload && payload.error;

    if (!window.opener) {
      throw new Error("No window opener");
    }
    if (error) {
      window.opener.postMessage({
        type: "OAUTH_RESPONSE",
        error: decodeURI(error) || "OAuth2 error: An error has occured."
      });
    } else {
      console.log("POST MESSAGE");
      window.opener.postMessage({
        type: "OAUTH_RESPONSE",
        payload
      });
    }
    // window.close();
  }, []);

  return (
    <div>
      <AutLoading />
    </div>
  );
};

export default Callback;
