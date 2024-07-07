import axios from "axios";
import { environment } from "./environment";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";
import { BrowserProvider } from "ethers";

export const AUTH_TOKEN_KEY = "user-access-token";

export const authorizeWithWeb3 = async (
  multiSigner: MultiSigner,
  address: string
): Promise<boolean | any> => {
  const responseNonce = await axios.get(
    `${environment.apiUrl}/autID/user/nonce/${address}`
  );
  const nonce = responseNonce.data.nonce;

  const message = `Your nonce is: ${nonce}`;
  const signer =
    multiSigner.signer instanceof BrowserProvider
      ? await multiSigner.signer.getSigner()
      : multiSigner.signer;
  const signature = await signer.signMessage(`${nonce}`);

  const jwtResponse = await axios.post(
    `${environment.apiUrl}/autID/user/getToken`,
    {
      address: address,
      signature
    }
  );
  localStorage.setItem(AUTH_TOKEN_KEY, jwtResponse.data.token);
  const isAuthorised = !!jwtResponse.data.token;
  return isAuthorised;
};
