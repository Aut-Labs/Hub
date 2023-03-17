import axios from "axios";

export const AUTH_TOKEN_KEY = "user-access-token";

export const authoriseWithWeb3 = async (signer) => {
  try {
    const account = await signer.getAddress();

    const responseNonce = await axios.get(
      `https://api.skillwallet.id/api/autID/user/nonce/${account}`
    );

    const nonce = responseNonce.data.nonce;

    const signature = await signer.signMessage(`${nonce}`);

    const jwtResponse = await axios.post(
      `https://api.skillwallet.id/api/autID/user/getToken`,
      {
        address: account,
        signature,
      }
    );
    localStorage.setItem(AUTH_TOKEN_KEY, jwtResponse.data.token);
    const isAuthorised = !!jwtResponse.data.token;
    return isAuthorised;
  } catch (error) {
    throw error;
  }
};
