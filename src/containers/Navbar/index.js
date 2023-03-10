import Box from "common/components/Box";
import NavbarWrapper from "common/components/Navbar";
import Container from "common/components/Container";
import { NavbarData } from "common/data";
import PropTypes from "prop-types";
import Logo from "common/components/UIElements/Logo";
import Button from "common/components/Button";
import { openModal } from "@redq/reuse-modal";
import Web3NetworkProvider from "common/ProviderFactory/components/Web3NetworkProvider";
import { useState } from "react";

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

const Navbar = ({ row, networks, onConnected }) => {
  const { logo } = NavbarData;
  const [isAuthorised, setIsAuthorised] = useState(false);

  const openPopup = () => {
    openModal({
      config: {
        className: "customModal",
        style: {
          transform: "scale(1)",
          border: 0,
          background: "red",
        },
        animationFrom: { transform: "scale(0.3)" }, // react-spring <Spring from={}> props value
        animationTo: { transform: "scale(1)" }, //  react-spring <Spring to={}> props value
        transition: {
          mass: 1,
          tension: 130,
          friction: 26,
        },
        disableDragging: true,
        width: 450,
        height: 450,
      },
      overlayClassName: "customeOverlayClass",
      closeOnClickOutside: false,
      component: Web3NetworkProvider,
      componentProps: {
        networks,
        onClose: async ({ connected, account }, errorMessage) => {
          setIsAuthorised(connected);
          onConnected(connected, account);
        },
      },
    });
  };

  const onDisconnect = () => {
    setIsAuthorised(false);
  }

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
          <Logo
            logoSrc={logo}
            href="/"
            alt="Aut Logo"
            logoStyle={logoStyles}
            className="sticky-logo nav-logo"
          />
          {!!isAuthorised && (
            <Button
              colors="primary"
              variant="roundOutlined"
              title="Disconnect"
              target="_blank"
              size="normal"
              onClick={onDisconnect}
              minWidth={{
                _: "220px",
              }}
            />
          )}
          {!isAuthorised && (
            <Button
              colors="primary"
              variant="roundOutlined"
              title="Connect"
              target="_blank"
              size="normal"
              onClick={openPopup}
              minWidth={{
                _: "220px",
              }}
            />
          )}
        </Box>
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
