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

import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { styled } from '@mui/material/styles';
import { TreeItem } from '@mui/lab';
import { normalizePath, urlFromSlug } from 'components/utils';

type InputProps = {
  level: number
};

const StyledTreeItemRoot = styled(TreeItem)<InputProps>(({ theme, level }) => ({
  color: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
  marginTop: 0,
  marginBottom: 0,
  marginLeft: '5px',
  '.MuiTreeItem-content': {
    padding: 0,
    // eslint-disable-next-line no-nested-ternary
    '& .MuiTreeItem-label': level === 1 ? {
      color: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
      textRendering: 'optimizeLegibility',
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '28px',
      marginTop: '4px',
      marginBottom: '4px',
      WebkitFontSmoothing: 'antialiased',
    } : (level === 2 || level === 3 ? {
      color: theme.palette.mode === 'light' ? '#4F4F4F' : '#D2D5DD',
      textRendering: 'optimizeLegibility',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Roboto',
      lineHeight: '17.5px',
      marginTop: '4px',
      marginBottom: '4px',
      WebkitFontSmoothing: 'antialiased',
    } : {
      color: theme.palette.mode === 'light' ? '#4F4F4F' : '#D2D5DD',
      textRendering: 'optimizeLegibility',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'Roboto',
      lineHeight: '17.5px',
      marginTop: '4px',
      marginBottom: '4px',
      WebkitFontSmoothing: 'antialiased',
      marginLeft: '-10px',
    }),
  },
}));

const CategoryItem = (({
  category, location, expanded, setExpanded, setSelected,
}: any) => {
  const active = normalizePath(category.slug) === normalizePath(location.pathname);
  const needsExpand = normalizePath(location.pathname).includes(normalizePath(category.slug));

  useEffect(
    () => {
      if (category && category.id) {
        if (needsExpand) {
          setTimeout(() => setExpanded([...expanded, category.id]));
        }
        if (active) {
          setSelected(category.id);
        }
      }
    }, [],
  );

  const goToPage = (link) => {
    const mmsc = document.getElementById('main-meu-scroll-container');
    // @ts-ignore
    window.mmscScrollTop = mmsc.scrollTop;
    navigate(link);
  };

  return (
    <StyledTreeItemRoot
      nodeId={category.id}
      label={category.title}
      level={category.level}
      onClick={() => goToPage(urlFromSlug(category.slug))}
    >
      {category.subCategories && category.subCategories.length
        ? category.subCategories.map((sub) => (
          <CategoryItem
            key={sub.id}
            location={location}
            category={sub}
            setSelected={setSelected}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        )) : null}
    </StyledTreeItemRoot>
  );
});
export default CategoryItem;
