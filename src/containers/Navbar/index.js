import Box from "common/components/Box";
import NavbarWrapper from "common/components/Navbar";
import Container from "common/components/Container";
import { NavbarData } from "common/data";
import PropTypes from "prop-types";
import Logo from "common/components/UIElements/Logo";
import Link from "next/link";
import Button from "common/components/Button";
import { useState } from "react";
import axios from "axios";
import {
  arrayify,
  hashMessage,
  recoverAddress,
  verifyMessage,
} from "ethers/lib/utils";

const navbarStyle = {
  className: "sass_app_dark_navbar",
  height: {
    _: "122px",
    xs: "122px",
    sm: "84px",
    md: "84px",
    xxl: "112px",
  },
  display: "block",
};

const logoStyles = {
  height: {
    _: "42px",
    xs: "42px",
    sm: "42px",
    md: "42px",
    xxl: "56px",
  },
  width: {
    _: "186px",
    xs: "186px",
    sm: "186px",
    md: "186px",
    xxl: "252px",
  },
};

const Navbar = ({ row, onConnected, connectors }) => {
  const { logo } = NavbarData;

  const [signing, setSigned] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    if (connectedAddress) {
      setConnectedAddress(null);
    } else {
      signMessage();
    }
  };

  const signMessage = async () => {
    setLoading(true);
    setSigned(true);
    try {
      const [connector] = connectors[0];
      await connector.activate();
      const accounts = await connector.provider.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      const responseNonce = await axios.get(
        `http://localhost:4005/api/autID/user/nonce/${account}`
      );

      const nonce = responseNonce.data.nonce;

      const signature = await connector.provider.request({
        method: "personal_sign",
        params: [nonce, account],
      });

      const jwtResponse = await axios.post(
        `http://localhost:4005/api/autID/user/getToken`,
        {
          address: account,
          signature,
        }
      );

      console.log(jwtResponse.data);

      const testAuth = await axios.get(
        `http://localhost:4005/api/autID/user/me`,
        {
          headers: {
            Authorization: jwtResponse.data.token,
          },
        }
      );

      console.log(testAuth.data);
      setConnectedAddress(testAuth.data.address);
      onConnected({
        connected: true,
        userData: testAuth.data,
      });
    } catch (error) {
      if (error?.code === 4001) {
        // setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
      setSigned(false);
    }
  };

  return (
    <NavbarWrapper {...navbarStyle}>
      <Container
        noGutter
        px={{
          _: "25px",
          sm: "0px",
        }}
        maxWidth={{
          lg: "1180px",
          xl: "1300px",
          xxl: "1600px",
        }}
      >
        <Box
          {...row}
          justifyContent={{
            _: "center",
            sm: "space-between",
          }}
        >
          <Link href="/" shallow>
            <Logo
              logoSrc={logo}
              alt="Aut Logo"
              logoStyle={logoStyles}
              className="sticky-logo nav-logo"
            />
          </Link>
        </Box>
        <Button
          colors="primary"
          variant="roundOutlined"
          title={connectedAddress || "Connect Wallet"}
          target="_blank"
          size="normal"
          isLoading={signing}
          disabled={loading}
          onClick={handleButtonClick}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: "block",
            textOverflow: "ellipsis",
          }}
          minWidth={{
            _: "260px",
          }}
          maxWidth={{
            _: "260px",
          }}
          height={{
            _: "60px",
          }}
        />
      </Container>
    </NavbarWrapper>
  );
};

Navbar.propTypes = {
  navbarStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  button: PropTypes.object,
  row: PropTypes.object,
  menuWrapper: PropTypes.object,
};

Navbar.defaultProps = {
  row: {
    flexBox: true,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  menuWrapper: {
    flexBox: true,
    alignItems: "center",
    justifyContent: "space-between",
  },
};

export default Navbar;
