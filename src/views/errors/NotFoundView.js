import React from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
const en={
  tilte:"404: The page you are looking for isn’t here",
  content:<span>You either tried some shady route or you came here by mistake.<br/>Whichever it is, try using the navigation</span>
}

const jp={
  tilte:"404：お探しのページがここにありません",
  content:<span>怪しげなルートを試したか、間違ってここに来ました。<br/>どちらでも、ナビゲーションを使用してみてください</span>
}
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFoundView = () => {
  const classes = useStyles();
  const [language, setLanguage] = React.useState(JSON.parse(localStorage.language).language);
  return (
    <Page
      className={classes.root}
      title="404"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography
            align="center"
            color="textPrimary"
            variant="h1"
          >
             {eval(language).tilte}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle2"
          >
            {eval(language).content}
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src="/static/images/undraw_page_not_found_su7k.svg"
            />
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default NotFoundView;
