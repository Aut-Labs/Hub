import axios from "axios";
import { environment } from "./environment";
import { ethers } from "ethers";

export const AUTH_TOKEN_KEY = "user-access-token";

export const authoriseWithWeb3 = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<boolean | any> => {
  const account = await signer.getAddress();

  const responseNonce = await axios.get(
    `${environment.apiUrl}/autID/user/nonce/${account}`
  );

  const nonce = responseNonce.data.nonce;

  const signature = await signer.signMessage(`${nonce}`);

  const jwtResponse = await axios.post(
    `${environment.apiUrl}/autID/user/getToken`,
    {
      address: account,
      signature
    }
  );
  localStorage.setItem(AUTH_TOKEN_KEY, jwtResponse.data.token);
  const isAuthorised = !!jwtResponse.data.token;
  return isAuthorised;
};
