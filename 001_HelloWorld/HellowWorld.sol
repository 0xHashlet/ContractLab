// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string private greeting;

    constructor(string memory _initialGreeting) {
        greeting = _initialGreeting;
    }

    function updateGreeting(string memory _newGreeting) public {
        greeting = _newGreeting;
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}