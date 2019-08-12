pragma solidity ^0.5.7;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IERC20.sol";

interface Transferable {
    function balanceOf(address who) external view returns (uint256);
    function transfer(address to, uint256 tokens)
        external
        returns (bool success);
}

contract DAPSSwap is Ownable {
    Transferable public transToken;

    mapping(address => string) public registers;

    event Put(address indexed eth, string indexed daps);

    constructor(Transferable _transToken) public {
        transToken = _transToken;
    }

    function burn() external {
        uint256 balance = transToken.balanceOf(address(this));
        transToken.transfer(address(0), balance);
    }

    function put(string calldata _daps) external {
        require(bytes(registers[msg.sender]).length == 0, "Already registered");
        registers[msg.sender] = _daps;
        emit Put(msg.sender, _daps);
    }

    function burn(IERC20 token, uint256 value) external {
        token.transfer(address(0), value);
    }

    function burnFrom(IERC20 token, address from, uint256 value) external {
        token.transferFrom(from, address(0), value);
    }
}
