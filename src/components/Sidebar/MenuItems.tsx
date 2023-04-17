/* eslint-disable max-len */
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { alpha, styled, SvgIcon } from "@mui/material";
import { ReactComponent as ManageIcon } from "@assets/manage.svg";
import { ReactComponent as DashboardIcon } from "@assets/dashboard.svg";
import { NavLink as RouteNavLink } from "react-router-dom";
import { forwardRef, Fragment } from "react";
import { pxToRem } from "@utils/text-size";

export interface SidebarMenuItem {
  title: string;
  route?: string;
  exact?: boolean;
  disabled?: boolean;
  icon?: any;
  children?: SidebarMenuItem[];
}

const menuItems: SidebarMenuItem[] = [
  {
    title: "Home",
    route: "/aut-dashboard",
    exact: true,
    icon: DashboardIcon
  },
  {
    title: "Community",
    icon: ManageIcon,
    route: "/aut-dashboard/members"
  }
];

const AutMenuItem = styled(ListItem)(({ theme }) => ({
  height: pxToRem(45),
  borderRadius: "4px",
  cursor: "pointer",
  transition: theme.transitions.create(["background-color", "color"]),
  color: "rgba(255, 255, 255, 0.7)",
  fontFamily: "FractulAltBold",
  ".MuiListItemIcon-root": {
    transition: theme.transitions.create(["color"]),
    color: "rgba(255, 255, 255, 0.7)",
    svg: {
      transition: theme.transitions.create(["fill"]),
      fill: "rgba(255, 255, 255, 0.7)"
    }
  },
  "&.active-link, &:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.16),
    color: "white",
    ".MuiListItemIcon-root": {
      color: "white",
      svg: {
        fill: "white"
      }
    }
  }
}));

const NavLink = forwardRef<any, any>((props, ref) => {
  return (
    <RouteNavLink
      ref={ref}
      end={props.end}
      to={props.to}
      className={({ isActive }) =>
        `${props.className} ${isActive ? props.activeClassName : ""}`
      }
    >
      {props.children}
    </RouteNavLink>
  );
});

const autMenuItem = (menu: SidebarMenuItem, level = 0) => {
  return (
    <AutMenuItem
      sx={{
        paddingLeft: level === 0 ? "15px" : `${level * 15 + 15}px`
      }}
      {...(!menu.disabled &&
        menu.route && {
          end: menu.exact,
          component: NavLink,
          activeClassName: "active-link",
          to: menu.route
        })}
    >
      <ListItemIcon
        sx={{
          color: "inherit",
          pr: 1,
          minWidth: "auto"
        }}
      >
        <SvgIcon
          sx={{
            height: pxToRem(19),
            width: pxToRem(19)
          }}
          component={menu.icon}
          inheritViewBox
        />
      </ListItemIcon>
      <Typography variant="body">{menu.title}</Typography>
    </AutMenuItem>
  );
};

const childItems = (menu: SidebarMenuItem, level = 1) => {
  return menu.children.map((childMenu, childIndex) => {
    return (
      <Fragment
        key={`child-menu-item-${level}-${childMenu.title}-${childIndex}`}
      >
        {autMenuItem(childMenu, level)}
        {childMenu?.children && childItems(childMenu, level + 1)}
      </Fragment>
    );
  });
};

const MenuItems = ({ addonMenuItems = [] }) => {
  return (
    <List
      sx={{
        width: "100%",
        flex: 1,
        p: 2,
        display: "flex",
        gridGap: "6px",
        flexDirection: "column"
      }}
      component="nav"
    >
      {[...menuItems, ...addonMenuItems].map((menu, index) => {
        return (
          <Fragment key={`menu-item-${menu.title}-${index}`}>
            {autMenuItem(menu)}
            {menu.children && childItems(menu)}
          </Fragment>
        );
      })}
    </List>
  );
};

export default MenuItems;
