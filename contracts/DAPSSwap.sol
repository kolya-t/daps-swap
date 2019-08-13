pragma solidity ^0.5.7;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Transferable.sol";

contract DAPSSwap is Ownable {
    uint256 internal constant MAX_CHANGE_TIMES = 5;

    Transferable public transToken;
    mapping(address => string[]) internal _registers;

    event Connect(address indexed eth, string indexed daps);
    event Reconnect(
        address indexed eth,
        string indexed oldDaps,
        string indexed newDaps
    );

    constructor(Transferable _transToken) public {
        transToken = _transToken;
    }

    function burn() external {
        uint256 balance = transToken.balanceOf(address(this));
        transToken.transfer(address(0), balance);
    }

    function connect(string calldata _daps) external {
        address eth = msg.sender;

        if (_registers[eth].length == 0) {
            emit Connect(eth, _daps);
            _registers[eth].push(_daps);
        } else {
            require(
                _registers[eth].length < MAX_CHANGE_TIMES,
                "Address change limit exceeded"
            );
            emit Reconnect(eth, getCurrentDAPSAddress(eth), _daps);
            _registers[eth].push(_daps);
        }
    }

    function burn(Transferable _token, uint256 _value) external {
        _token.transfer(address(0), _value);
    }

    function burnFrom(Transferable _token, address _from, uint256 _value)
        external
    {
        _token.transferFrom(_from, address(0), _value);
    }

    function isConnected(address _eth) public view returns (bool) {
        return _registers[_eth].length != 0;
    }

    function getCurrentDAPSAddress(address _eth)
        public
        view
        returns (string memory)
    {
        if (!isConnected(_eth)) {
            string memory empty;
            return empty;
        }

        uint256 count = _registers[_eth].length;
        return _registers[_eth][count - 1];
    }

    function getDAPSAddressByIndex(address _eth, uint256 _index)
        public
        view
        returns (string memory)
    {
        return _registers[_eth][_index];
    }
}
