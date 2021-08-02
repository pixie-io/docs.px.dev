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

import React from 'react';
import PropTypes from 'prop-types';
import styles from './poi-tooltip.module.scss';

const PoiTooltip = ({ children, top, left }) => (
  <div
    className={styles.main}
    style={{
      top: `calc(${top}% - 30px)`, left: `calc(${left}% - 30px)`,
    }}
    data-tooltip
  >
    <div className={styles.circle} />
    <div
      className={`${styles.tooltip} ${
        left > 50 ? styles.rightSide : ''
      }`}
      style={{ maxWidth: `${left > 50 ? `${100 - left}vw` : 'calc(50vw - 32px)'}` }}
    >
      {children}
    </div>
  </div>
);

PoiTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
};

PoiTooltip.defaultProps = {};
export default PoiTooltip;
