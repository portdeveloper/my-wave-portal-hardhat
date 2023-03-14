// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint) public waves;
    mapping(address => string[]) public waveMessages;
    mapping(address => uint256) public messageTimes;
    event Wave(address _from, string _message);

    function wave(string memory _message) public {
        require(
            messageTimes[msg.sender] < block.timestamp - 30 seconds,
            "you sent a msg in the last 30 secs, please wait"
        );
        waves[msg.sender] += 1;
        waveMessages[msg.sender].push(_message);
        totalWaves += 1;
        messageTimes[msg.sender] = block.timestamp;
        emit Wave(msg.sender, _message);
    }

    function getMessages(
        address _address
    ) public view returns (string[] memory) {
        return waveMessages[_address];
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
