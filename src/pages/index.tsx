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
import { graphql, Link } from 'gatsby';
import {
  Box, Container, Modal, Typography, Grid, Hidden, Button,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/material/styles';

import SEO from 'components/seo';
import { urlFromSlug } from 'components/utils';
import { Layout } from 'components';
import Footer from '../components/footer';

import opbrImg from '../images/page-ornaments/ornament-page-bottom-right.svg';
import nextBtn from '../images/btn-next-icon.svg';
import ornamentLeft from '../images/ornament-left.svg';
import ornamentRight from '../images/ornament-right.svg';
import cncfLogoWhite from '../images/cncf-white.svg';
import cncfLogoColor from '../images/cncf-color.svg';

const MainButton = styled(Button)(({ theme }) => ({
  minHeight: '54px',
  marginBottom: '20px',
  borderColor: theme.palette.mode === 'light' ? '#12D6D6' : '#3FE7E7',
  [theme.breakpoints.down('md')]: {
    minWidth: '200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  flexDirection: 'row',
  fontSize: '14px',
  '& svg': {
    marginRight: '3px',
  },
  outlined: {
    color: theme.palette.mode === 'light' ? '#12D6D6' : '#3FE7E7',
  },
  contained: {
    color: '#0C1714',
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  paddingTop: '125px',
  paddingBottom: '95px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '28px',
    lineHeight: '35px',
    paddingTop: '60px',
  },
}));

const SectionHeadingGuides = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: '75px',
  paddingBottom: '95px',
  [theme.breakpoints.down('md')]: {
    fontSize: '28px',
    lineHeight: '35px',
  },
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  marginTop: '7px',
  marginBottom: '7px',
  paddingBottom: '7px',
  border: 'none',
  [theme.breakpoints.down('md')]: {
    fontSize: '30px',
    lineHeight: '38px',
    paddingTop: '20px',
    paddingBottom: '30px',
  },
}));


const IndexPage = withStyles((theme) => ({
  pageContainer: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#161616',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  hero: {
    background: theme.palette.mode === 'light'
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
    paddingTop: '57px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      paddingTop: '50px',
      flexDirection: 'column',
    },
  },
  guideButton: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '&.MuiButton-outlined': {
      color: theme.overrides.MuiTypography.body1.color,
      flexDirection: 'column',
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },
  },
  gridButton: {
    color: theme.palette.mode === 'light' ? '#121212' : '#9696A5',
    minHeight: '150px',
    maxWidth: 'calc(100% - 16px)',
    marginBottom: '16px',
    borderColor: '#353738',
    flexDirection: 'column',
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
  sectionTitle: {
    marginTop: 0,
    marginBottom: 0,
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
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
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
      [theme.breakpoints.down('md')]: {
        paddingBottom: 0,
        paddingTop: 0,
        fontSize: '28px',
        lineHeight: '35px',
      },
    },
  },
  image_title: {
    fontSize: '28px',
    lineHeight: '35px',
    borderBottom: 'none',
    [theme.breakpoints.down('md')]: {
      paddingTop: 0,
    },
  },
  cncfFooter: {
    paddingTop: '128px',
    position: 'relative',
    '& a': {
      color: '#12D6D6',
      textDecoration: 'none',
    },
    '& p': {
      fontSize: '18px',
      lineHeight: '24px',
      color: theme.overrides.MuiTypography.body1.color,
      paddingBottom: '36px',
    },
  },
  logoWhite: {
    display: theme.palette.mode === 'light' ? 'none' : 'block',
    width: '80%',
    maxWidth: '300px',
    margin: '0 auto 40px',
  },
  logoColor: {
    display: theme.palette.mode === 'light' ? 'block' : 'none',
    width: '80%',
    maxWidth: '300px',
    margin: '0 auto 40px',
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
          <Hidden mdDown implementation='css'>
            <img className={classes.ornamentLeft} src={ornamentLeft} />
            <img className={classes.ornamentRight} src={ornamentRight} />
          </Hidden>
          <Container maxWidth='md'>
            <Grid
              container
              direction='row'
              sx={{
                justifyContent: 'center',
                alignItems: 'stretch',
                textAlign: 'center',
              }}
            >
              <Grid item xs={12} md={8}>
                <MainHeading variant='h1'>
                  Instant open-source debugging for your applications on Kubernetes
                </MainHeading>
                <Typography variant='body1'>
                  Learn how to install Pixie, run scripts and write your own playbooks.
                </Typography>
              </Grid>
              <Box className={classes.buttonsBar}>
                <Hidden mdDown implementation='css'>
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
              </Box>
            </Grid>
          </Container>

        </section>
        <section>
          <Container id='scripts-section'>
            <SectionHeading variant='h1'>
              Run Pixie Scripts to answer all system performance questions
            </SectionHeading>
            <Grid
              container
              direction='row'
              justifyContent='center'
              alignItems='stretch'
              spacing={3}
            >
              {sections.map((section) => (
                <Grid item xs={6} sm={4} md={3} key={section.id}>
                  <Link
                    to={urlFromSlug(section.slug)}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant='outlined' fullWidth className={classes.gridButton}>
                      <Typography variant='h3' className={classes.sectionTitle}>{section.title}</Typography>
                      <Typography variant='body2'>
                        {section.description}
                      </Typography>
                    </Button>
                  </Link>
                </Grid>
              ))}

            </Grid>
          </Container>
          <Container>
            <SectionHeadingGuides variant='h3'>
              Try one of these getting started guides
            </SectionHeadingGuides>

            <Box className={classes.guided_buttons_row}>
              <Grid container justifyContent='center'>
                {guides.map((guide) => (
                  <Grid item xs={6} sm={4} md={3} key={guide.id} sx={{ p: 3 }}>
                    <Link
                      to={urlFromSlug(guide.slug)}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant='outlined'
                        fullWidth
                        className={classes.guideButton}
                        sx={{
                          borderColor: 'transparent',
                          borderWidth: 1,
                          minHeight: '139px',
                          flexDirection: 'column',
                          fontSize: '16px',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'primary.main',
                            borderColor: 'secondary.main',
                          },
                        }}
                      >
                        <img
                          src={guide.icon.node.publicURL}
                          alt=''
                          className={classes.btn_icon}
                        />
                        {guide.title}
                      </Button>

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
                <Button
                  color='secondary'
                  variant='contained'
                  sx={{
                    height: '64px',
                    fontSize: '16px',
                    minWidth: '230px',
                    justifyContent: 'space-around',
                  }}
                  endIcon={(
                    <img
                      src={nextBtn}
                      className={classes.btn_horizontal_icon}
                    />
                  )}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Container>
        </section>
        <div className={classes.cncfFooter}>
          <p align='center'>
            We are a
            {' '}
            <a href='https://cncf.io/' target='_blank' rel='noreferrer'>Cloud Native Computing Foundation</a>
            {' '}
            sandbox project.
          </p>
          <img src={cncfLogoWhite} alt='CNCF logo' className={classes.logoWhite} />
          <img src={cncfLogoColor} alt='CNCF logo' className={classes.logoColor} />
        </div>
        <Footer />
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
