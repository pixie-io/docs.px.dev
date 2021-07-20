/*
 * Copyright 2018- The Pixie Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import {
  Box, Container, Modal, Theme, Typography,
} from '@material-ui/core';
import { graphql, Link } from 'gatsby';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { darken, lighten } from '@material-ui/core/styles';

import SEO from 'components/seo';
import { urlFromSlug } from 'components/utils';
import { Layout } from 'components';

import opbrImg from '../images/page-ornaments/ornament-page-bottom-right.svg';

import nextBtn from '../images/btn-next-icon.svg';
import ornamentLeft from '../images/ornament-left.svg';
import ornamentRight from '../images/ornament-right.svg';
import FooterLinks from '../components/footer-links';

const MainButton = withStyles((theme: Theme) => ({
  root: {
    minHeight: '54px',
    marginBottom: '20px',
    borderColor: theme.palette.type === 'light' ? '#12D6D6' : '#3FE7E7',
    [theme.breakpoints.down('sm')]: {
      minWidth: '200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  label: {
    flexDirection: 'row',

    fontSize: '14px',
    '& svg': {
      marginRight: '3px',
    },
  },
  outlined: {
    color: theme.palette.type === 'light' ? '#12D6D6' : '#3FE7E7',
  },
  contained: {
    color: '#0C1714',
    label: {
      color: '#0C1714',
    },
  },

}))(Button);

const GuideButton = withStyles((theme: Theme) => ({
  root: {
    color: '#3FE7E7',
    borderColor: 'transparent',
    borderWidth: 1,
    minHeight: '139px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      borderColor: theme.palette.secondary.main,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  label: {
    color: theme.overrides.MuiTypography.body1.color,
    flexDirection: 'column',
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },

}))(Button);

const NextButton = withStyles(() => ({
  root: {
    height: '64px',
    fontSize: '16px',
    minWidth: '230px',
  },
  label: {
    justifyContent: 'space-around',
  },
}))(Button);

const ButtonsBar = withStyles((theme: Theme) => ({
  root: {
    paddingTop: '57px',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '30px',
      flexDirection: 'column',
    },
  },
}))(Box);

const GridButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.type === 'light' ? '#121212' : '#9696A5',
    minHeight: '150px',
    maxWidth: 'calc(100% - 16px)',
    marginBottom: '16px',
    borderColor: '#353738',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: '#121212',
      borderColor: theme.palette.secondary.main,
      '& p': {
        color: '#121212',
      },
      '& h5': {
        color: '#121212',
      },
    },
  },
  label: {
    flexDirection: 'column',
  },

}))(Button);

const IndexPage = withStyles((theme: Theme) => ({
  pageContainer: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.background.default : '#161616',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  mainHeading: {
    marginTop: '7px',
    marginBottom: '7px',
    paddingBottom: '7px',
    border: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px',
      lineHeight: '38px',
      paddingTop: '20px',
      paddingBottom: '30px',
    },
  },
  hero: {
    background: theme.palette.type === 'light'
      ? ' linear-gradient(0deg, rgba(196, 196, 196, 0) 0.24%, rgba(26, 26, 26, 0.06) 100%)'
      : 'linear-gradient(0deg, rgba(196, 196, 196, 0) 0.81%, rgba(26, 26, 26, 0.06) 100%)',

    minHeight: '536px',
    paddingTop: '125px',
    position: 'relative',
    padding: '0 16px',
    [theme.breakpoints.down('md')]: {
      paddingTop: '40px',
    },
  },
  buttonsBar: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '50px',
    },
  },
  smallText: {
    paddingTop: '32px',
    fontFamily: '"Roboto mono", monospace',
  },

  ornamentLeft: {
    position: 'absolute',
    left: '22px',
    bottom: '22px',
    maxWidth: 'calc(100vw - 22px)',
  },

  ornamentRight: {
    position: 'absolute',
    right: '22px',
    bottom: '22px',
  },

  videoModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
  },

  ornament_page_bottom_right: {
    position: 'absolute',
    right: '15px',
    bottom: '15px',
  },

  codeRenderer: {
    marginTop: '80px',
  },
  codeRenderer_mobile: {
    marginTop: '30px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  sectionHeading: {
    paddingTop: '125px',
    paddingBottom: '95px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '28px',
      lineHeight: '35px',
      paddingTop: '60px',
    },
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  sectionHeading_guides: {
    textAlign: 'center',
    paddingTop: '75px',
    paddingBottom: '95px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '28px',
      lineHeight: '35px',
    },
  },

  btn_icon: {
    display: 'block',
    padding: '20px',
  },

  btn_horizontal_icon: {
    paddingLeft: '20px',
  },

  guided_buttons_row: {
    paddingBottom: '90px',
    maxWidth: '90%',
    margin: '0 auto',
  },

  next_button_row: {
    height: '266px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: '166px',
    },
  },

  middle_container: {
    position: 'relative',
    marginBottom: '35px',
  },

  upper_connector_line: {
    position: 'absolute',
    right: '77%',
    top: '-21%',
  },

  lower_connector_line: {
    position: 'absolute',
    right: '81%',
    top: '73%',
  },

  heading_image: {
    width: '90%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: '70px',
      width: '75%',
      maxWidth: '210px',
    },
  },

  image_description: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    '& h4': {
      paddingBottom: '32px',
      [theme.breakpoints.down('sm')]: {
        paddingBottom: 0,
        paddingTop: 0,
        fontSize: '28px',
        lineHeight: '35px',
      },
    },
  },
  copyright: {
    textAlign: 'center',
    paddingBottom: '16px',
    color: theme.palette.type === 'light' ? lighten(theme.overrides.MuiTypography.body2.color, 0.4) : darken(theme.overrides.MuiTypography.body2.color, 0.4),
  },
  image_title: {
    fontSize: '28px',
    lineHeight: '35px',
    borderBottom: 'none',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },
  },
}))(({ location, classes, data }: any) => {
  const sections = data.featuredInstalls.edges.map((e) => ({
    slug: e.node.fields.slug,
    title: e.node.fields.title,
    id: e.node.fields.id,
    description: e.node.fields.description,
  }));

  const guides = data.featuredGuides.edges.map((e) => ({
    slug: e.node.fields.slug,
    title: e.node.fields.title,
    id: e.node.fields.id,
    icon: data.icons.edges.find((i) => i.node.base === e.node.fields.icon),
  }));

  const [openVideo, setOpenVideo] = React.useState(false);
  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  return (
    <Layout location={location}>
      <SEO
        title='Using Pixie | Pixie Product Documentation'
        description="Live-debug distributed environments with Pixie's auto-telemetry."
      />
      <div className={classes.pageContainer}>
        <section className={classes.hero}>
          <Hidden smDown implementation='css'>
            <img className={classes.ornamentLeft} src={ornamentLeft} />
            <img className={classes.ornamentRight} src={ornamentRight} />
          </Hidden>
          <Container maxWidth='md'>
            <Grid
              container
              direction='row'
              justify='center'
              alignItems='stretch'
              align='center'
            >
              <Grid item xs={12} md={8}>
                <Typography variant='h1' className={classes.mainHeading}>
                  Instant open-source debugging for your applications on Kubernetes
                </Typography>
                <Typography variant='body1'>
                  Learn how to install Pixie, run scripts and write your own playbooks.
                </Typography>
              </Grid>
              <ButtonsBar justify='center' className={classes.buttonsBar}>
                <Hidden smDown implementation='css'>
                  <MainButton
                    color='secondary'
                    variant='contained'
                    size='large'
                    onClick={handleOpenVideo}
                  >
                    <PlayArrowIcon />
                    Pixie in 60 seconds
                  </MainButton>
                </Hidden>
                <Hidden mdUp implementation='css'>
                  <a
                    style={{ textDecoration: 'none' }}
                    href='https://www.youtube.com/watch?v=5oY_ova5GrA&'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <MainButton
                      color='secondary'
                      variant='contained'
                      size='large'
                    >
                      <PlayArrowIcon />
                      Pixie in 45 seconds
                    </MainButton>
                  </a>
                </Hidden>
                <MainButton
                  variant='outlined'
                  color='secondary'
                  size='large'
                  href='/installing-pixie'
                >
                  Install Guide
                </MainButton>
              </ButtonsBar>
            </Grid>
          </Container>

        </section>
        <section>
          <Container id='scripts-section'>
            <Typography variant='h1' className={classes.sectionHeading}>
              Run Pixie Scripts to answer all system performance questions
            </Typography>
            <Grid
              container
              direction='row'
              justify='center'
              alignItems='stretch'
              spacing={3}
            >
              {sections.map((section) => (
                <Grid item xs={6} sm={4} md={3} key={section.id}>
                  <Link
                    to={urlFromSlug(section.slug)}
                    style={{ textDecoration: 'none' }}
                  >
                    <GridButton variant='outlined' fullWidth>
                      <Typography variant='h3' className={classes.sectionTitle}>{section.title}</Typography>
                      <Typography variant='body2'>
                        {section.description}
                      </Typography>
                    </GridButton>
                  </Link>
                </Grid>
              ))}

            </Grid>
          </Container>
          <Container>
            <Typography variant='h3' className={classes.sectionHeading_guides}>
              Try one of these getting started guides
            </Typography>

            <Box className={classes.guided_buttons_row}>
              <Grid container spacing={6} justify='center'>
                {guides.map((guide) => (
                  <Grid item xs={6} sm={4} md={3} key={guide.id}>
                    <Link
                      to={urlFromSlug(guide.slug)}
                      style={{ textDecoration: 'none' }}
                    >
                      <GuideButton variant='outlined' fullWidth>
                        <img
                          src={guide.icon.node.publicURL}
                          alt=''
                          className={classes.btn_icon}
                        />
                        {guide.title}
                      </GuideButton>

                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
          <Container>
            <Box className={classes.next_button_row}>
              <Link
                to={urlFromSlug('/installing-pixie')}
                style={{ textDecoration: 'none' }}
              >
                <NextButton
                  color='secondary'
                  variant='contained'
                  endIcon={(
                    <img
                      src={nextBtn}
                      className={classes.btn_horizontal_icon}
                    />
                  )}
                >
                  Get Started
                </NextButton>
              </Link>
            </Box>
          </Container>
        </section>
        <div className={classes.copyright}>
          <FooterLinks />
          Copyright © 2020 Pixie Labs
        </div>
        <Hidden mdDown implementation='css'>
          <img className={classes.ornament_page_bottom_right} src={opbrImg} />
        </Hidden>
        <Modal
          open={openVideo}
          onClose={handleCloseVideo}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <div className={classes.videoModal}>
            <iframe
              width='560'
              height='315'
              src='https://www.youtube.com/embed/5oY_ova5GrA'
              frameBorder='0'
              allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </Modal>
      </div>
    </Layout>
  );
});

export default IndexPage;
export const pageQuery = graphql`
    query {
        featuredInstalls: allMdx(limit: 8, sort: {fields: fields___sorting_field, order: ASC}, filter: {fields: {featuredInstall: {eq: true}}}) {
            edges {
                node {
                    id
                    fields {
                        id
                        title
                        slug
                        description
                    }
                }
            }
        }
        featuredGuides: allMdx(limit: 8, sort: {fields: fields___sorting_field, order: ASC}, filter: {fields: {featuredGuide: {eq: true}}}) {
            edges {
                node {
                    id
                    fields {
                        id
                        title
                        slug
                        description
                        icon
                    }
                }
            }
        }
          icons:allFile(filter: {relativeDirectory: {  regex: "/assets/" }}) {
            edges {
                node {
                    absolutePath
                    publicURL
                    base
                }
            }
        }

    }
`;
