### Avoiding Common Attacks

Some of the measures taken to avoid common attacks in my contract include:

* Considering SWC-103 (uses specific solidity pragma, 0.8.0 in this case)
* Considering SWC-135 (the Paster contract does not include code with no effects)
* Considering SWC-115 (the Paster contract does not authorize via the unsafe tx.origin)
* Considering SWC-110 (the Paster contract makes proper use of assert when checking the byte length of the snippet content)