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
    if (!window.opener && !error) {
      localStorage.setItem("OAUTH_RESPONSE", JSON.stringify({ payload }));
      window.close();
    } else if (!window.opener && error) {
      localStorage.setItem("OAUTH_RESPONSE", JSON.stringify({ error }));
      window.close();
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
  }, []);

  return (
    <div>
      <AutLoading width="130px" height="130px" />
    </div>
  );
};

export default Callback;
