import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Button,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from 'src/components/Logo';
import {logout} from '../../assets/login';
const useStyles = makeStyles(() => ({
  root: {
    zIndex:1201,
  },
}));

const en={
  logoutbutton:"LOGOUT"
}

const jp={
  logoutbutton:"ログアウト"
}

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [language, setLanguage] = React.useState(JSON.parse(localStorage.language).language);
  async function handleLogout() {
    await logout();
    window.location.assign('/');
  }

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/app">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
          <Button
            className="btn btn-logout"
            onClick={handleLogout}
          >
          {eval(language).logoutbutton}
          </Button>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
