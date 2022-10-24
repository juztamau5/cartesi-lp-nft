// Copyright 2022 juztamau5

// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";
import path from "path";

// read MNEMONIC from env variable
const mnemonic = process.env.MNEMONIC;

const ppath = (packageName: string, pathname: string) => {
  return path.join(
    path.dirname(require.resolve(`${packageName}/package.json`)),
    pathname
  );
};

const infuraNetwork = (
  network: string,
  chainId?: number,
  gas?: number
): HttpNetworkUserConfig => {
  return {
    url: `https://${network}.infura.io/v3/${process.env.PROJECT_ID}`,
    chainId,
    gas,
    accounts: mnemonic ? { mnemonic } : undefined,
  };
};

const config: HardhatUserConfig = {
  networks: {
    hardhat: mnemonic ? { accounts: { mnemonic } } : {},
    localhost: {
      url: "http://localhost:8545",
      accounts: mnemonic ? { mnemonic } : undefined,
    },
    mainnet: infuraNetwork("mainnet", 1, 6283185),
    goerli: infuraNetwork("goerli", 5, 6283185),
    polygon_mumbai: infuraNetwork("polygon-mumbai", 80001),
    arbitrum_goerli: infuraNetwork("arbitrum-goerli", 421613),
    optimism_goerli: infuraNetwork("optimism-goerli", 420),
  },
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        // Required by Uniswap V3
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        // Required by Cartesi token
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  paths: {
    artifacts: "artifacts",
    deploy: "deploy",
    deployments: "deployments",
  },
  abiExporter: {
    // Path to ABI export directory (relative to Hardhat root)
    path: "./src/abi",
    // Whether to automatically export ABIs during compilation
    runOnCompile: true,
    // Whether to delete old files in path
    clear: true,
    // Whether to use interface-style formatting of output for better readability
    pretty: true,
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  external: {
    contracts: [
      {
        artifacts: ppath("@cartesi/util", "/export/artifacts"),
        deploy: ppath("@cartesi/util", "/dist/deploy"),
      },
      {
        artifacts: ppath("@cartesi/token", "/export/artifacts"),
        deploy: ppath("@cartesi/token", "/dist/deploy"),
      },
    ],
    deployments: {
      localhost: ["deployments/localhost"],
      mainnet: [
        ppath("@cartesi/util", "/deployments/mainnet"),
        ppath("@cartesi/token", "/deployments/mainnet"),
      ],
      goerli: [
        ppath("@cartesi/util", "/deployments/goerli"),
        ppath("@cartesi/token", "/deployments/goerli"),
      ],
      polygon_mumbai: [
        ppath("@cartesi/util", "/deployments/polygon_mumbai"),
        ppath("@cartesi/token", "/deployments/polygon_mumbai"),
      ],
      arbitrum_goerli: [
        ppath("@cartesi/util", "/deployments/arbitrum_goerli"),
        ppath("@cartesi/token", "/deployments/arbitrum_goerli"),
      ],
      optimism_goerli: [
        ppath("@cartesi/util", "/deployments/optimism_goerli"),
        ppath("@cartesi/token", "/deployments/optimism_goerli"),
      ],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    beneficiary: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;
