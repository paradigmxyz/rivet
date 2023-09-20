// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Playground {
    event Approve(address indexed spender, uint256 amount);

    event TestEventRivet1(
        uint256 indexed a,
        bool b,
        string c,
        uint256 indexed d
    );

    struct Foo {
        uint x;
        bool y;
    }

    function test_rivet_1(
        uint256 a,
        bool b,
        Foo memory c,
        Foo[] memory d
    ) public returns (bool success) {
        emit TestEventRivet1(a, b, "rivet", c.x);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        emit Approve(spender, amount);
        return true;
    }
}
