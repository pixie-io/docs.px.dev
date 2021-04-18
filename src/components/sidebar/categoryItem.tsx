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

import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';

import { navigate } from 'gatsby';
import { TreeItem } from '@material-ui/lab';
import { normalizePath, urlFromSlug } from 'components/utils';

const CategoryItem = withStyles((theme: Theme) => ({
  category: {
    color: theme.palette.type === 'light' ? '#000000' : '#ffffff',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: '5px',
  },
  label_1: {
    color: theme.palette.type === 'light' ? '#000000' : '#ffffff',
    textRendering: 'optimizeLegibility',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '28px',
    marginTop: '4px',
    marginBottom: '4px',
    WebkitFontSmoothing: 'antialiased',
  },
  label_2: {
    color: theme.palette.type === 'light' ? '#4F4F4F' : '#D2D5DD',
    textRendering: 'optimizeLegibility',
    fontSize: '14px',
    fontFamily: 'Roboto',
    lineHeight: '17.5px',
    marginTop: '4px',
    marginBottom: '4px',
    WebkitFontSmoothing: 'antialiased',
  },
  label_4: {
    color: theme.palette.type === 'light' ? '#4F4F4F' : '#D2D5DD',
    textRendering: 'optimizeLegibility',
    fontSize: '14px',
    fontFamily: 'Roboto',
    lineHeight: '17.5px',
    marginTop: '4px',
    marginBottom: '4px',
    WebkitFontSmoothing: 'antialiased',
    marginLeft: '-10px',
  },
  iconContainer: {},

}))(({
  category, classes, location, expanded, setExpanded, setSelected,
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

  const getLevelClass = (level) => {
    switch (level) {
      case 1:
        return classes.label_1;
      case 2:
      case 3:
        return classes.label_2;
      default:
        return classes.label_4;
    }
  };

  const goToPage = (link) => {
    navigate(link);
  };
  return (
    <TreeItem
      className={classes.category}
      nodeId={category.id}
      label={category.title}
      classes={{
        label: getLevelClass(category.level),
        iconContainer: classes.iconContainer,
      }}
      onLabelClick={() => goToPage(urlFromSlug(category.slug))}
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
    </TreeItem>
  );
});
export default CategoryItem;
