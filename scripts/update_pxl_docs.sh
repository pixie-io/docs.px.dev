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

curl -fSsL -o external/pxl_documentation.json https://storage.googleapis.com/pl-docs/pxl-docs.json
