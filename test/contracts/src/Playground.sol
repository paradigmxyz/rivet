// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Playground {
    struct Foo {
        uint x;
        bool y;
    }

    function test_rivet_1(
        uint256 a,
        bool b,
        Foo memory c,
        Foo[] memory d
    ) public returns (bool success) {}

    function approve(address spender, uint256 amount) public returns (bool) {}
}
