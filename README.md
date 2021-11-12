# blockchain-developer-bootcamp-final-project
### Blockchain Developer Bootcamp 2021 final project

### ⛓️ My public Ethereum address: ollywilson.eth

### front-end address of client: https://main.d3q4rm1dxseubq.amplifyapp.com/

### Explain in a very simple way what you'd like your project to do:

Act as a de-centralized version of a code-snippet sharing site. Users (likely devs) can upload sections of code (including comments and readmes). Code snippets will be nicely formatted by the front-end. Snippets can selectively be marked as eligible for public edit, or not (off by default). Allowing for de-centralized deployment of code sections will allow useful snippets to remain indefinitely, and not-reliant on any legacy centralized service.

### Developer Certification bullet points

1. Naming structure (see the URL on this page)
2. Contain a README.md (this file). The folder structure includes: /contracts (the main Paster.sol contract), /migrations (the contract migrations), /public (the front-end public html and associated files), /src (front-end js), and /test (Paster.sol contract test file)
3. Contain smart contract(s) which:
- Are commented to the specs described: see contracts/Paster.sol and its commenting
- Use at least two design patterns from the "Smart Contracts" section: Uses 1) inheritance (of the Initializable and Ownable from OpenZeppelin) and 2) Upgradeable Contracts (also via OpenZeppelin Initializable)
- Protect against two attack vectors from the "Smart Contracts" section: SWC-103 (uses specific solidity pragma) and SWC-135 (does not have code with no effects), and SWC-115 (does not authorize via tx.origin), (plus SWC-110 - by proper use of assert)
- Inherits from at least one library or interface: inherits from Initializable and Ownable (OpenZeppelin)
- Can be easily compiled, migrated and tested (see #5)
4. Contain a Markdown file named design_pattern_decisions.md and avoiding_common_attacks.md (see those files in this repository)
5. Have at least five unit tests for your smart contract(s) that pass: see those in test/TestPaster.sol
6. Contain a deployed_address.txt file -- see that file in this repository
7. Have a frontend interface (that is responsive to Metamask) - deployed on AWS's free Amplify service - found at:
8. Hosted on a front-end service - deployed on Amplify - found at the deployed address: https://main.d3q4rm1dxseubq.amplifyapp.com/
9. Installing dependencies, accessing, and running smart contract tests:

### Dependencies and instructions for running locally, and running tests:
- Check out code from this repository
- ```cd``` into the directory
- ```npm install```
- If running with a local server (such as Ganache on port 7545), ensure the ```develop``` property under ```networks``` in truffle-config.js is uncommented
- ```truffle compile```
- create a .env file at the top level of the folder, with ```PROVIDER_URL=http://127.0.0.1:8545``` (a .env.example file is provided as an example)
- ```truffle migrate``` (assuming you have a local ganache server)
- to start the client front-end app (in a different terminal window), ```npm run start```
- switching to Chrome, enter the mnemonic from your Ganache server into Metamask
- access the front-end running locally at localhost:3000
- to run the contract tests, run ```truffle test```

10. Screencast: link: https://www.loom.com/share/0aacef0fe91b43dea3e9734459e6528d

### Walk through a single workflow for the future user of your project:

1. A user navigates to the app
2. They will have a unique mapping to a code snippet via their address
3. A user adds a new code snippet - their address is how we know they are creator of that snippet
4. The creator of the code snippet, using the front-end, can mark a snippet as eligible for public edit
4. Other addresses, if designated as owners, can view and edit the code snippet, if so marked (via entering the relevant address in the URL path)

### Core functions / functionality

Front-end:
* Allow for the pasting / typing of new code snippets
* Indicate the edit status of a given code snippet
* Display the selected code snippet

Contracts:
* Hold the information regarding the code snippet content
* Hold the information regarding the edit status for a given snippet
* Allow for change of edit status of addresses for a given snippet

### Future considerations:

Ultimately, would a fully fledged version of this system (with much more robust and involved permissioning / editing capabilities) be useful to dev communities / teams?
