pragma solidity 0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Paster.sol";

contract TestPaster {
    Paster paster = Paster(DeployedAddresses.Paster());

    //The expected addressSnippet is this contract
    address expectedAddressSnippet = address(this);

    // Testing the addPasteSnippet() function - ensure a new snippet can be successfully added
    function testUserCanAddSnippet() public {
        bool returnedPasteSnippet = paster.addPasteSnippet(
            "name",
            "content",
            "javascript"
        );

        Assert.equal(
            returnedPasteSnippet,
            true,
            "Successfully added code snippet"
        );
    }

    // Testing the getPasteSnippet() function - ensure an existing snippet can be successfully returned
    function testUserCanGetSpecificSnippet() public {
        (
            string memory name,
            string memory content,
            string memory lang,
            address address_snippet,
            bool public_edit
        ) = paster.getPasteSnippet(expectedAddressSnippet);

        Assert.equal(
            name,
            "name",
            "Successfully returned specific snippet name"
        );
        Assert.equal(
            content,
            "content",
            "Successfully returned specific snippet content"
        );
        Assert.equal(
            lang,
            "javascript",
            "Successfully returned specific snippet lang"
        );
        Assert.equal(
            address_snippet,
            expectedAddressSnippet,
            "Successfully returned specific snippet address_snippet"
        );
        Assert.equal(
            public_edit,
            false,
            "Successfully returned specific snippet public edit status"
        );
    }

    // Testing the changePasteSnippetContent() function - ensure an existing snippet's content and lang can be successfully modified
    function testUserCanChangePasteSnippetContent() public {
        bool returnStatusOfChangingSnippetContent = paster
            .changePasteSnippetContent(
                expectedAddressSnippet,
                "new content",
                "python"
            );

        Assert.equal(
            returnStatusOfChangingSnippetContent,
            true,
            "Successfully updated snippet content and lang"
        );
    }

    // Testing the changePasteSnippetPublicEdit() function - ensure an existing snippet's edit status can be successfully modified
    function testUserCanChangePasteSnippetPublicEdit() public {
        bool returnStatusOfChangingSnippetPublicEdit = paster
            .changePasteSnippetPublicEdit(expectedAddressSnippet, true);

        Assert.equal(
            returnStatusOfChangingSnippetPublicEdit,
            true,
            "Successfully updated snippet public_edit"
        );
    }

    // Testing the getPasteSnippet() function after having called the update functions
    // - ensure that it has been correctly modified
    function testUserCanGetSpecificSnippetAfterUpdate() public {
        (
            string memory name,
            string memory content,
            string memory lang,
            address address_snippet,
            bool public_edit
        ) = paster.getPasteSnippet(expectedAddressSnippet);

        Assert.equal(
            name,
            "name",
            "Successfully returned specific snippet name"
        );
        Assert.equal(
            content,
            "new content",
            "Successfully returned specific snippet content"
        );
        Assert.equal(
            lang,
            "python",
            "Successfully returned specific snippet lang"
        );
        Assert.equal(
            address_snippet,
            expectedAddressSnippet,
            "Successfully returned specific snippet address_snippet"
        );
        Assert.equal(
            public_edit,
            true,
            "Successfully returned specific snippet public edit status"
        );
    }
}
