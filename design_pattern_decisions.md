### Design Pattern Decisions

Some of the key design decisions made in my contract include:

* Using inheritance -- the Paster.sol contract inherits from the OpenZeppelin contracts Initializable, and OwnableUpgradeable -- meaning that the contract can be upgraded (and thus uses a proxy contract), and can be made ownable -- in this case, the example function permitted by the contract owner is the change the maximum length (in bytes) of the code snippets that can be added to a new PasteSnippet. Having the contract be upgradeable (via Initializable) allows for more easy future changes, and flexibility.

* Access Control Design Patterns - as above, the contract implements OwnableUpgradeable, allowing for a function which permits the change in the maximum byte length of the snippet pastes.

* Upgradable Contracts - as above, the contract implements Initializable, allowing for the deployed contract to be upgraded