# CW20 Factory Token

This token uses the implementation of [cw-plus/cw20-base](https://github.com/CosmWasm/cw-plus/tree/0.9.x/contracts/cw20-base) with an additional parameter that allow developers to instantiate the contract assigning an owner to **Mint** or **Burn** CW20 token units, this could be useful when a smart contract is meant to create or destroy tokens with user execution.