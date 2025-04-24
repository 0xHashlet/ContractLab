// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入OpenZeppelin的Ownable合约，用于实现基本的访问控制
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

// Counter合约继承自Ownable，实现了一个简单的计数器功能
contract Counter is Ownable {
    // 私有状态变量，用于存储计数值
    uint256 private _count;

    // 定义事件，当计数更新时触发，记录新值和操作者地址
    event CountUpdated(uint256 newValue, address operator);

    // 构造函数，初始化Ownable并设置合约部署者为owner
    constructor() Ownable(msg.sender) {}

    // 查看当前计数的函数，使用view修饰符表示不修改状态
    function current() public view returns (uint256) {
        return _count;
    }

    // 增加计数的函数
    function increment() public {
        _count += 1;
        emit CountUpdated(_count, msg.sender);
    }

    // 减少计数的函数
    function decrement() public {
        require(_count > 0, "Counter: cannot decrement below zero");
        _count -= 1;
        emit CountUpdated(_count, msg.sender);
    }

    // 重置计数为0的函数，只有owner可以调用
    function reset() public onlyOwner {
        _count = 0;
        emit CountUpdated(_count, msg.sender);
    }
}