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
import { graphql, StaticQuery } from 'gatsby';
import { styled } from '@mui/material/styles';
import { ThemeModeContext } from '../mainThemeProvider';

const Caption = styled('figcaption')(({ theme }) => ({
  color: theme.overrides.MuiTypography.body1.color,
}));

const SvgRenderer = ({ src, title }) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
             publicURL
            }
          }
        }
      }
    `}
    render={(data) => {
      const lastDot = src.lastIndexOf('.');

      const fileName = src.substring(0, lastDot);
      const ext = src.substring(lastDot + 1);

      const image = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${src}`));
      const lightImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-light.${ext}`));
      const darkImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-dark.${ext}`));

      const getImageSrc = (theme) => {
        if (theme === 'light' && lightImage) {
          return lightImage.node.publicURL;
        }
        if (theme === 'dark' && darkImage) {
          return darkImage.node.publicURL;
        }
        return image.node.publicURL;
      };
      if (!image) {
        return null;
      }
      return (
        <ThemeModeContext.Consumer>
          {({ theme }) => (
            <figure className='gatsby-resp-image-figure'>
              <img alt='' src={getImageSrc(theme)} className='doc-image' />
              <Caption className='gatsby-resp-image-figcaption MuiTypography-body1'>{title}</Caption>
            </figure>
          )}
        </ThemeModeContext.Consumer>
      );
    }}
  />
);

export default SvgRenderer;
