//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoteApp {
    struct Task {
        uint256 taskid;
        address writer;
        string content;
        string author;
        bool done;
    }

    Task[] public tasks;

    function createTask(string memory _content, string memory _author)
        external
    {
        address _writer = msg.sender;
        tasks.push(Task(tasks.length, _writer, _content, _author, false));
    }

    function getTask(uint256 _id)
        external
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            bool
        )
    {
        return (
            _id,
            tasks[_id].writer,
            tasks[_id].content,
            tasks[_id].author,
            tasks[_id].done
        );
    }

    function getTasks() external view returns (Task[] memory) {
        return tasks;
    }

    function setDoneTrue(uint256 _index) external {
        address _writer = msg.sender;
        require(tasks[_index].writer == _writer);
        tasks[_index].done = !tasks[_index].done;
    }

    function callerFunc() external view returns (address) {
        address caller = msg.sender;
        return caller;
    }

    function deleteTask(uint256 _index) external returns (Task[] memory) {
        delete tasks[_index];
        return tasks;
    }
}
