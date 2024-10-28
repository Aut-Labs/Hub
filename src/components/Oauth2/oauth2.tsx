import { environment } from "@api/environment";
import axios from "axios";
import { useCallback, useState, useRef } from "react";

const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;

const openPopup = (url) => {
  const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
  const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
  const win = window.open(
    url,
    "",
    `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`
  );
  return win;
};

const cleanup = (intervalRef, popupRef, handleMessageListener) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  if (popupRef.current) {
    popupRef.current.close();
  }
  window.removeEventListener("message", handleMessageListener);
};

const xCleanUp = (xIntervalRef) => {
  if (xIntervalRef.current) {
    clearInterval(xIntervalRef.current);
  }
};

export const useOAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [finsihedFlow, setFinishedFlow] = useState(false);
  const popupRef = useRef<Window>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const getAuth = useCallback(async (onSuccess, onFailure) => {
    setAuthenticating(true);
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    const callbackUrl = encodeURI(`${window.location.origin}/callback`);
    popupRef.current = openPopup(
      `https://discord.com/oauth2/authorize?response_type=code&client_id=1080508975780474900&scope=guilds&state=15773059ghq9183habn&redirect_uri=${callbackUrl}&prompt=consent`
    ) as any;

    async function handleMessageListener(message) {
      try {
        const type = message && message.data && message.data.type;
        if (type === "OAUTH_RESPONSE") {
          console.log("RECEIVE MESSAGE");
          const error = message && message.data && message.data.error;
          if (error) {
            onFailure(error);
          } else {
            const response = await axios.post(
              `${environment.apiUrl}/aut/config/oauth2AccessToken`,
              {
                code: message.data.payload.code,
                callbackUrl
              }
            );
            setAuthenticating(false);
            clearInterval(intervalRef.current);
            popupRef.current.close();
            onSuccess(response.data);
            cleanup(intervalRef, popupRef, handleMessageListener);
          }
        }
      } catch (genericError) {
        onFailure(genericError);
        console.error(genericError);
      }
    }
    window.addEventListener("message", handleMessageListener);

    //Check for abrupt closing of popup
    intervalRef.current = setInterval(() => {
      const popupClosed =
        !popupRef.current ||
        !(popupRef.current as any).window ||
        (popupRef.current as any).window.closed;
      if (popupClosed) {
        setAuthenticating(false);
        clearInterval(intervalRef.current);
        window.removeEventListener("message", handleMessageListener);
        onFailure();
      }
    }, 550);

    return () => {
      setAuthenticating(false);
      cleanup(intervalRef, popupRef, handleMessageListener);
    };
  }, []);

  return { getAuth, authenticating };
};

export const useOAuthSocials = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [finsihedFlow, setFinishedFlow] = useState(false);
  const popupRef = useRef<Window>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const xIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const getAuthDiscord = useCallback(async (onSuccess, onFailure) => {
    setAuthenticating(true);
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    const callbackUrl = encodeURI(`${window.location.origin}/callback`);
    popupRef.current = openPopup(
      `https://discord.com/oauth2/authorize?client_id=${environment.discordClientId}&response_type=code&redirect_uri=${callbackUrl}&scope=identify+guilds`
    ) as any;

    async function handleMessageListener(message) {
      try {
        const type = message && message.data && message.data.type;
        if (type === "OAUTH_RESPONSE") {
          const error = message && message.data && message.data.error;
          if (error) {
            onFailure(error);
          } else {
            const response = await axios.post(
              `${environment.apiUrl}/aut/config/oauth2AccessTokenDiscord`,
              {
                code: message.data.payload.code,
                callbackUrl
              }
            );
            setAuthenticating(false);
            clearInterval(intervalRef.current);
            popupRef.current.close();
            onSuccess(response.data);
            cleanup(intervalRef, popupRef, handleMessageListener);
          }
        }
      } catch (genericError) {
        onFailure(genericError);
        console.error(genericError);
      }
    }
    window.addEventListener("message", handleMessageListener);

    //Check for abrupt closing of popup
    intervalRef.current = setInterval(() => {
      const popupClosed =
        !popupRef.current ||
        !(popupRef.current as any).window ||
        (popupRef.current as any).window.closed;
      if (popupClosed) {
        setAuthenticating(false);
        clearInterval(intervalRef.current);
        window.removeEventListener("message", handleMessageListener);
        onFailure();
      }
    }, 550);

    return () => {
      setAuthenticating(false);
      cleanup(intervalRef, popupRef, handleMessageListener);
    };
  }, []);

  const getAuthX = useCallback(async (onSuccess, onFailure) => {
    setAuthenticating(true);
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    const callbackUrl = encodeURI(`${window.location.origin}/callback`);
    popupRef.current = openPopup(
      `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${environment.twitterClientId}&state=state&scope=tweet.read%20users.read%20offline.access&redirect_uri=${callbackUrl}&code_challenge=challenge&code_challenge_method=plain`
    ) as any;

    async function handleMessageListener(message) {
      try {
        const type = message && message.data && message.data.type;
        if (type === "OAUTH_RESPONSE") {
          const error = message && message.data && message.data.error;
          if (error) {
            onFailure(error);
          } else {
            xCleanUp(xIntervalRef);
            const response = await axios.post(
              `${environment.apiUrl}/aut/config/oauth2AccessTokenX`,
              {
                code: message.data.payload.code,
                callbackUrl
              }
            );
            setAuthenticating(false);
            clearInterval(intervalRef.current);
            popupRef.current.close();
            onSuccess(response.data);
            cleanup(intervalRef, popupRef, handleMessageListener);
          }
        }
      } catch (genericError) {
        onFailure(genericError);
        console.error(genericError);
      }
    }
    window.addEventListener("message", handleMessageListener);

    //Check for abrupt closing of popup
    intervalRef.current = setInterval(() => {
      const popupClosed =
        !popupRef.current ||
        !(popupRef.current as any).window ||
        (popupRef.current as any).window.closed;
      if (popupClosed) {
        setAuthenticating(false);
        clearInterval(intervalRef.current);
        window.removeEventListener("message", handleMessageListener);
        onFailure();
      }
    }, 550);

    xIntervalRef.current = setInterval(async () => {
      const oauthResponse = JSON.parse(localStorage.getItem("OAUTH_RESPONSE"));
      if (oauthResponse) {
        cleanup(intervalRef, popupRef, handleMessageListener);
        localStorage.removeItem("OAUTH_RESPONSE");
        try {
          if (oauthResponse.error) {
            onFailure(oauthResponse.error);
          } else {
            const response = await axios.post(
              `${environment.apiUrl}/aut/config/oauth2AccessTokenX`,
              {
                code: oauthResponse.payload.code,
                callbackUrl
              }
            );
            setAuthenticating(false);
            popupRef.current.close();
            onSuccess(response.data);
            xCleanUp(xIntervalRef);
          }
        } catch (genericError) {
          onFailure(genericError);
          console.error(genericError);
        }
      }
    }, 550);

    return () => {
      setAuthenticating(false);
      cleanup(intervalRef, popupRef, handleMessageListener);
      xCleanUp(xIntervalRef);
    };
  }, []);

  const getAuthGithub = useCallback(async (onSuccess, onFailure) => {
    setAuthenticating(true);
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    const callbackUrl = encodeURI(`${window.location.origin}/callback`);
    popupRef.current = openPopup(
      `https://github.com/login/oauth/authorize?response_type=code&client_id=${environment.githubClientId}&state=state&scope=read:user&redirect_uri=${callbackUrl}`
    ) as any;

    async function handleMessageListener(message) {
      try {
        const type = message && message.data && message.data.type;
        if (type === "OAUTH_RESPONSE") {
          const error = message && message.data && message.data.error;
          if (error) {
            onFailure(error);
          } else {
            const response = await axios.post(
              `${environment.apiUrl}/aut/config/oauth2AccessTokenGithub`,
              {
                code: message.data.payload.code,
                callbackUrl
              }
            );
            setAuthenticating(false);
            clearInterval(intervalRef.current);
            popupRef.current.close();
            onSuccess(response.data);
            cleanup(intervalRef, popupRef, handleMessageListener);
          }
        }
      } catch (genericError) {
        onFailure(genericError);
        console.error(genericError);
      }
    }
    window.addEventListener("message", handleMessageListener);

    //Check for abrupt closing of popup
    intervalRef.current = setInterval(() => {
      const popupClosed =
        !popupRef.current ||
        !(popupRef.current as any).window ||
        (popupRef.current as any).window.closed;
      if (popupClosed) {
        setAuthenticating(false);
        clearInterval(intervalRef.current);
        window.removeEventListener("message", handleMessageListener);
        onFailure();
      }
    }, 550);

    return () => {
      setAuthenticating(false);
      cleanup(intervalRef, popupRef, handleMessageListener);
    };
  }, []);

  return { getAuthDiscord, getAuthX, getAuthGithub, authenticating };
};
