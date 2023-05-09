import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";

interface AutTabParams {
  label: string;
  component: any;
  props: {
    [key: string]: any;
  };
}

interface AutTabsParams {
  tabs: AutTabParams[];
  selectedTabIndex?: number;
  selectedTab?: (value: any, event: React.SyntheticEvent) => void;
  tabStyles?: React.CSSProperties | SxProps<any>;
}

function TabPanel(props: any) {
  const { children, value, index, sx, ...other } = props;
  return (
    <div
      role="tabpanel"
      className="sw-tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box
          className="tab-content"
          sx={{
            p: "10px 30px 0 30px",
            borderTopRightRadius: "16px",
            // boxShadow: 3,
            border: "2px solid",
            // bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderBottomRightRadius: "16px",
            borderBottomLeftRadius: "16px",
            height: "calc(100%)",
            ...(sx || {})
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function AutTabs(props: AutTabsParams) {
  const [value, setSelectedIndex] = React.useState(props.selectedTabIndex || 0);

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    setSelectedIndex(index);
    props.selectedTab && props.selectedTab(index, event);
  };

  const handleChangeIndex = (index: number) => {
    setSelectedIndex(index);
    props.selectedTab && props.selectedTab(index, null);
  };

  return (
    <Box
      className="aut-tabs"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        ...props.tabStyles
      }}
    >
      <Box>
        <Tabs
          // variant="fullWidth"
          value={value}
          onChange={handleChange}
          sx={{
            ".MuiTabs-indicator": {
              display: "none"
            },
            ".MuiButtonBase-root": {
              boxShadow: 3,
              height: {
                xs: "45px",
                xxl: "70px"
              },
              width: {
                xs: "180px",
                lg: "200px",
                xxl: "240px"
              },
              borderColor: "divider",
              backgroundColor: "nightBlack.main",
              textTransform: "inherit",
              borderStyle: "solid",
              borderWidth: "2px",
              color: "white",
              borderBottom: 0,
              "&.Mui-selected": {
                bgcolor: "offWhite.main",
                color: "nightBlack.main"
              },
              "&:first-of-type": {
                borderTopLeftRadius: "16px"
              },
              "&:last-child": {
                borderTopRightRadius: "16px"
              }
            }
          }}
        >
          {props.tabs.map(({ label }) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>
      {props.tabs.map(({ props: childProps, component }, index) => {
        const Component = component;
        return (
          <TabPanel key={index} value={value} index={index}>
            <Component {...childProps} />
          </TabPanel>
        );
      })}
    </Box>
  );
}

export default React.memo(AutTabs);
