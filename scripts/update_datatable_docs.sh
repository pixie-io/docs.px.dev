#!/bin/bash

# Copyright 2018- The Pixie Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

# Script downloads and updates the pxl docs file that is rendered.
#
# We chose to manually render this instead of automatically to prevent any unintended  updates
# from a bug  in the documentation parser pipeline.


# This script takes 1 argument -> a cluster ID.
# Check to make sure a cluster ID is specified.
if [ $# -eq 0 ]; then
  echo "Cluster ID not specified:"
  echo "    --> Run: px get viziers | grep HEALTHY"
  echo "    --> Copy cluster ID of any cluster running the latest vizier version."
  exit 1
fi

# Run px/schemas.
clusterid=$1
px run px/schemas -c "${clusterid}" -o json > schemas.txt

# Process json output.
go run ./datatable_docstrings.go