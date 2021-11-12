pragma solidity 0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title A web 3.0 code snippet paster contract
/// @author Olly W.
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract Paster is Initializable, OwnableUpgradeable {
    // Variables and Structs:

    /// @notice Returns the PasteSnippet at a specific address in the mapping
    /// @return a PasteSnippet instance
    mapping(address => PasteSnippet) public paste_snippets;

    /// @dev The maximum length of a code snippet
    uint256 maxSnippetLength;

    /// @notice contract initialization function, sets maxSnippetLength to 1024 bytes
    function initialize() public initializer {
        maxSnippetLength = 1024;
    }

    /// @notice A struct defining the PasteSnippet - a specific instance of a code snippet associated with an address
    /// @param name The name of the snippet
    /// @param content The content of the snippet - the code paste itself
    /// @param lang The language (e.g., javascript, python etc) of the snippet
    /// @param address_snippet The address associated with the snippet
    /// @param public_edit A flag to define whether the snippet can be edited by anyone or not
    struct PasteSnippet {
        string name;
        string content;
        string lang;
        address address_snippet;
        bool public_edit;
    }

    // Events:

    /// @notice An event to log the address sent in a call
    /// @param _address the address to log in the event
    event LogSender(address _address);

    // Modifiers:

    /// @notice A modifier to check whether a PasteSnippet is associated with an address
    /// @param _address the address to check association with
    modifier isAddressSnippet(address _address) {
        require(paste_snippets[_address].address_snippet == msg.sender);
        _;
    }

    /// @notice modifier to check whether a PasteSnippet is either publicly editable, or if the PasteSnippet is associated with an address
    /// @param _address the address to check the edit status of
    modifier verifyCaller(address _address) {
        require(
            paste_snippets[_address].address_snippet == msg.sender ||
                paste_snippets[_address].public_edit == true,
            "Not permitted - this address is not the address_snippet and this snippet is not publicly editable"
        );
        _;
    }

    // Functions:

    /// @notice Function to change the maximum length (in bytes) of a code snippet, may only be called by the contract owner
    /// @dev only callable by contract owner
    /// @param _length new length in bytes for the maxSnippetLength
    function changeMaxSnippetLength(uint256 _length) public payable onlyOwner {
        maxSnippetLength = _length;
    }

    /// @notice A function to add a new PasteSnippet, or change the PasteSnippet at a specific address
    /// @param _name the name of the code snippet
    /// @param _content the actual content of the code snippet
    /// @param _lang the language of the code snippet
    /// @return boolean success of the function
    function addPasteSnippet(
        string memory _name,
        string memory _content,
        string memory _lang
    ) public payable returns (bool) {
        require(
            bytes(_content).length <= maxSnippetLength,
            "content string over max length"
        );
        paste_snippets[msg.sender] = PasteSnippet({
            name: _name,
            content: _content,
            lang: _lang,
            address_snippet: msg.sender,
            public_edit: false
        });
        emit LogSender(msg.sender);

        return true;
    }

    /// @notice A function to get the information of a specific snippet at a specific address
    /// @param _address the address associated with the snippet to retrieve
    /// @return name - the name of the relevant snippet
    /// @return content - the actual content of the relevant snippet
    /// @return lang - the lang (e.g., javascript) of the relevant snippet
    /// @return address_snippet - the address associated with the snippet
    /// @return public_edit - whether or not this snippet can be publicly edited
    function getPasteSnippet(address _address)
        public
        payable
        returns (
            string memory name,
            string memory content,
            string memory lang,
            address address_snippet,
            bool public_edit
        )
    {
        name = paste_snippets[_address].name;
        content = paste_snippets[_address].content;
        lang = paste_snippets[_address].lang;
        address_snippet = paste_snippets[_address].address_snippet;
        public_edit = paste_snippets[_address].public_edit;
        emit LogSender(msg.sender);
        return (name, content, lang, address_snippet, public_edit);
    }

    /// @notice A function to change only the content and lang of a PasteSnippet at a specific address
    /// @param _address the address associated with the snippet to change
    /// @param _content the new content for this snippet
    /// @param _lang the new lang for this snippet
    /// @return boolean success of the function
    function changePasteSnippetContent(
        address _address,
        string memory _content,
        string memory _lang
    ) public payable verifyCaller(_address) returns (bool) {
        require(
            bytes(_content).length <= maxSnippetLength,
            "content string over max length"
        );
        paste_snippets[_address].content = _content;
        paste_snippets[_address].lang = _lang;
        return true;
    }

    /// @notice A function to change only the publicly editable status of a PasteSnippet at a specific address
    /// @param _address the address associated with the snippet to change
    /// @param _status the new public_edit status for the snippet
    /// @return boolean success of the function
    function changePasteSnippetPublicEdit(address _address, bool _status)
        public
        payable
        isAddressSnippet(msg.sender)
        returns (bool)
    {
        paste_snippets[_address].public_edit = _status;
        return true;
    }
}
