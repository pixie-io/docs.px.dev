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
import path from 'path';
import { makeStyles } from '@material-ui/core/styles';
import { CloudLinkContext } from '../cloudLinkProvider';
import CodeRenderer from './codeRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: theme.palette.secondary.main,
    fontFamily: 'inherit',
    fontStyle: 'inherit',
    fontSize: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'underline',
    },
  },
}));

interface Props {
  children: string;
}

export const CliDeployInstructions: React.FC<Props> = ({ children }) => {
  const codeBlock = `
# List Pixie deployment options.
px deploy --help

# Deploy the Pixie Platform in your K8s cluster (No OLM present on cluster).
export PL_CLOUD_ADDR=@@
px deploy

# Deploy the Pixie Platform in your K8s cluster (OLM already exists on cluster).
export PL_CLOUD_ADDR=@@
px deploy --deploy_olm=false

# Deploy Pixie with a specific memory limit (2Gi is the default, 1Gi is the minimum recommended)
export PL_CLOUD_ADDR=@@
px deploy --pem_memory_limit=1Gi

  `;
  return (
    <CloudLinkContext.Consumer>
      {({ selectedCloud }) => (
        <CodeRenderer
          code={codeBlock.replaceAll("@@", selectedCloud.cloudAddr)}
          language='bash' />
      )}
    </CloudLinkContext.Consumer>
  );
};

interface CloudLinkProps {
  children: string;
  url: string;
}

export const CloudLink: React.FC<CloudLinkProps> = ({ children, url }) => {
  const classes = useStyles();
  return (
    <CloudLinkContext.Consumer>
      {({ selectedCloud }) => (
        <a href={path.join(selectedCloud.baseUrl, url)} className={classes.link}>
          {children}
        </a>
      )}
    </CloudLinkContext.Consumer>
  );
};
