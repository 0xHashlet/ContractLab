// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title 多签钱包合约
 * @notice 基于OpenZeppelin的AccessControl实现的多签钱包，需要达到指定阈值确认才能执行交易
 */
contract MultiSigWallet is AccessControl {
    /// @notice 提案者角色，拥有提交交易的权限
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    
    /// @notice 执行者角色，拥有执行交易的权限
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    /**
     * @dev 交易数据结构
     * @param to 目标地址
     * @param value 转账金额(wei)
     * @param data 调用数据
     * @param executed 是否已执行
     * @param confirmations 当前确认数
     */
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    uint256 public threshold;
    uint256 public nonce;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    event ProposalCreated(
        uint256 proposalId,
        address proposer,
        address to,
        uint256 value,
        bytes data
    );
    
    event Confirmed(uint256 proposalId, address confirmator);
    event Executed(uint256 proposalId);

    modifier onlyProposer() {
        require(hasRole(PROPOSER_ROLE, msg.sender), "Not a proposer");
        _;
    }

    modifier notExecuted(uint256 proposalId) {
        require(!transactions[proposalId].executed, "Already executed");
        _;
    }

    /**
     * @dev 构造函数，初始化多签钱包
     * @param _owners 所有者地址数组
     * @param _threshold 执行交易所需的最小确认数
     * @notice 每个所有者将被授予DEFAULT_ADMIN_ROLE和PROPOSER_ROLE
     */
    constructor(address[] memory _owners, uint256 _threshold) {
        require(_owners.length >= _threshold, "Invalid threshold");
        require(_threshold > 0, "Threshold must be > 0");
        
        threshold = _threshold;
        nonce = 0;

        // 权限修改需要通过多签流程
        // _grantRole(DEFAULT_ADMIN_ROLE, multiSigAdminAddress);
        for (uint256 i = 0; i < _owners.length; i++) {
            _grantRole(PROPOSER_ROLE, _owners[i]);
            _grantRole(EXECUTOR_ROLE, _owners[i]); // 新增这行
        }
    }

    /**
     * @dev 提交新交易提案
     * @param _to 目标地址
     * @param _value 转账金额(wei)
     * @param _data 调用数据
     * @notice 只有PROPOSER_ROLE可以调用
     * @notice 自动递增nonce作为提案ID
     */
    function submitTransaction(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external onlyProposer notExecuted(nonce) {
        transactions[nonce] = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0
        });
        
        emit ProposalCreated(nonce, msg.sender, _to, _value, _data);
        nonce++;
    }

    /**
     * @dev 确认交易提案
     * @param _proposalId 提案ID
     * @notice 只有DEFAULT_ADMIN_ROLE可以调用
     * @notice 每个地址只能确认一次
     * @notice 增加提案的确认计数
     */
    function confirmTransaction(uint256 _proposalId) 
        external 
        notExecuted(_proposalId)
    {
        require(!confirmations[_proposalId][msg.sender], "Already confirmed");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        
        confirmations[_proposalId][msg.sender] = true;
        transactions[_proposalId].confirmations++;

        emit Confirmed(_proposalId, msg.sender);
    }

    /**
     * @dev 执行交易提案
     * @param _proposalId 提案ID
     * @notice 需要达到阈值确认数才能执行
     * @notice 执行后标记为已执行状态
     * @notice 如果执行失败会回滚
     */
    function executeTransaction(uint256 _proposalId)
        external
        notExecuted(_proposalId)
    {
        require(hasRole(EXECUTOR_ROLE, msg.sender), "Not an executor");
        Transaction storage transaction = transactions[_proposalId];
        require(
            transaction.confirmations >= threshold,
            "Insufficient confirmations"
        );

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction failed");

        emit Executed(_proposalId);
    }

    /**
     * @dev 获取当前交易提案总数
     * @return 交易提案总数
     */
    function getTransactionCount() external view returns (uint256) {
        return nonce;
    }
}