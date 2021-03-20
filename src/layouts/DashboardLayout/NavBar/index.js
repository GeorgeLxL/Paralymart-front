import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    background:"#F6F6F7",
    borderColor:"#b9b6b6",
    height: 'calc(100% - 64px)'
  }
}));

const en={
  artworklabel:"ARTWORK",
  artistlabel:"ARTIST",
  accountlabel:"ACCOUNT",
}

const jp={
  artworklabel:"作品",
  artistlabel:"作者",
  accountlabel:"管理",
}


const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [language, setLanguage] = React.useState(JSON.parse(localStorage.language).language);
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);  

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Divider />
      <Box>
        <List>
            <ListItem
              className="item"
            >
              <Button
                className="nav-button"
                component={RouterLink}
                to="/admin/work"
              >
                 <svg width="35" height="34" viewBox="0 0 35 34">
                    <defs>
                      <clipPath id="clip-path">
                        <rect id="Rectangle_896" data-name="Rectangle 896" width="35" height="34" />
                      </clipPath>
                    </defs>
                    <g id="Mask_Group_24" data-name="Mask Group 24" clipPath="url(#clip-path)">
                      <g id="frame-landscape" transform="translate(0.544 3.881)">
                        <path id="Path_131" data-name="Path 131" d="M33.519,2.429H.54a.54.54,0,0,0-.54.54V28.754a.54.54,0,0,0,.54.54H33.519a.539.539,0,0,0,.54-.54V2.969A.539.539,0,0,0,33.519,2.429Zm-2.7,22.562L23.4,17.306a.221.221,0,0,0-.3-.012l-5.147,4.531-6.579-8.1a.217.217,0,0,0-.176-.082.22.22,0,0,0-.172.089L3.238,24.172V5.667H30.821V24.991Z" transform="translate(0 -2.429)"/>
                        <path id="Path_132" data-name="Path 132" d="M16.169,11.6a2.648,2.648,0,1,0-2.647-2.647A2.648,2.648,0,0,0,16.169,11.6Z" transform="translate(6.501 -0.566)" />
                      </g>
                    </g>
                  </svg>
                <span className="nav-title">
                {eval(language).artworklabel}
                </span>
              </Button>
            </ListItem>

            <ListItem
              className="item"
            >
              <Button
                className="nav-button"
                component={RouterLink}
                to="/admin/author"
              >
                  <svg width="36" height="35" viewBox="0 0 36 35">
                    <defs>
                      <clipPath id="clip-path">
                        <rect id="Rectangle_5" data-name="Rectangle 5" width="36" height="35" />
                      </clipPath>
                    </defs>
                    <g id="Mask_Group_23" data-name="Mask Group 23" clipPath="url(#clip-path)">
                      <g id="man-with-beret" transform="translate(1.781 0)">
                        <g id="Group_608" data-name="Group 608">
                          <ellipse id="Ellipse_25" data-name="Ellipse 25" cx="1.833" cy="0.733" rx="1.833" ry="0.733" transform="translate(14.729 24.05)" />
                          <circle id="Ellipse_26" data-name="Ellipse 26" cx="1.65" cy="1.65" r="1.65" transform="translate(9.932 18.637)" />
                          <circle id="Ellipse_27" data-name="Ellipse 27" cx="1.65" cy="1.65" r="1.65" transform="translate(19.892 18.637)" />
                          <path id="Path_130" data-name="Path 130" d="M31.381,19.063c-.01-.1-.023-.2-.034-.293a11.6,11.6,0,0,0,.126-1.318,4.409,4.409,0,0,0,2.112-4.039c-.375-3.379-4.127-6.192-8.872-8.172-.079-2.7-2.549-5-5.73-5.222a6.263,6.263,0,0,0-5.475,2.306A27.226,27.226,0,0,0,7.5,2.177c-3.674.4-6.53,2.813-6.67,7.061A5.664,5.664,0,0,0,3.555,14.3a12.683,12.683,0,0,0-.109,4.634c0,.028-.007.057-.01.085a4.894,4.894,0,0,0-1.817,3.835A4.8,4.8,0,0,0,4.892,27.47a14.164,14.164,0,0,0,25.038-.018,4.8,4.8,0,0,0,3.219-4.6A4.893,4.893,0,0,0,31.381,19.063Zm-2.81,5.674a1.434,1.434,0,0,1-.6-.134A11.207,11.207,0,0,1,6.84,24.59a1.473,1.473,0,0,1-.641.147,1.9,1.9,0,0,1,0-3.758,9.277,9.277,0,0,0,.865,1.238,11.444,11.444,0,0,1-.472-3.192,9.292,9.292,0,0,1,.327-2.441,6.212,6.212,0,0,1,.271-.71c.359.095.719.181,1.077.251a73.06,73.06,0,0,0,12.484.368,10.921,10.921,0,0,0,5.575,2.313,9.269,9.269,0,0,0,1.848-.09c0,.1.015.2.015.307a11.437,11.437,0,0,1-.473,3.192,9.324,9.324,0,0,0,.866-1.238,1.9,1.9,0,0,1-.007,3.758Z" transform="translate(-0.823 0)"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                <span className="nav-title">
                {eval(language).artistlabel}
                </span>
              </Button>
            </ListItem>
            <ListItem
              className="item"
            >
              <Button
                className="nav-button"
                component={RouterLink}
                to="/admin/account"
              >
                  <svg id="networking" width="35" height="35" viewBox="0 0 35 35">
                    <path id="Path_21" data-name="Path 21" d="M32.448,0H2.552A2.555,2.555,0,0,0,0,2.552V6.2A2.555,2.555,0,0,0,2.552,8.75h29.9A2.555,2.555,0,0,0,35,6.2V2.552A2.555,2.555,0,0,0,32.448,0Z" />
                    <path id="Path_22" data-name="Path 22" d="M20.781,11.667H2.552A2.564,2.564,0,0,0,0,14.219V32.448A2.564,2.564,0,0,0,2.552,35H20.781a2.564,2.564,0,0,0,2.552-2.552V14.219a2.564,2.564,0,0,0-2.552-2.552ZM11.667,17.5a2.187,2.187,0,1,1-2.188,2.188A2.185,2.185,0,0,1,11.667,17.5Zm4.375,9.115a1.1,1.1,0,0,1-1.094,1.094H8.385a1.1,1.1,0,0,1-1.094-1.094v-.54a2.914,2.914,0,0,1,3.062-2.742h2.625a2.914,2.914,0,0,1,3.062,2.742Z" />
                    <circle id="Ellipse_1" data-name="Ellipse 1" cx="4.375" cy="4.375" r="4.375" transform="translate(26.25 25.521)" />
                    <path id="Path_23" data-name="Path 23" d="M33.906,16.042H27.344a1.094,1.094,0,0,0,0,2.188h6.563a1.094,1.094,0,0,0,0-2.187Z" />
                    <path id="Path_24" data-name="Path 24" d="M33.906,11.667H27.344a1.094,1.094,0,1,0,0,2.187h6.563a1.094,1.094,0,1,0,0-2.187Z" />
                    <path id="Path_25" data-name="Path 25" d="M33.906,20.417H27.344a1.094,1.094,0,0,0,0,2.188h6.563a1.094,1.094,0,0,0,0-2.187Z" />
                  </svg>
                <span className="nav-title">
                {eval(language).accountlabel}
                </span>
              </Button>
            </ListItem>
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
