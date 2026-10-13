// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/**
 * @title KiteDePINComputeAttestation
 * @notice DePIN Edge AI Compute Attestation & x402 Node Staking Protocol on Kite Chain.
 */
contract KiteDePINComputeAttestation {
    struct ComputeNode {
        address operator;
        bytes32 hardwareFingerprint;
        uint256 vramMb;
        uint256 flopsTier;
        uint256 stakedAmount;
        uint256 totalWorkloadsCompleted;
        bool isCertified;
    }

    mapping(bytes32 => ComputeNode) public nodes;
    uint256 public constant MIN_STAKE = 0.05 ether;
    uint256 public totalActiveNodes;

    event NodeRegistered(bytes32 indexed nodeId, address indexed operator, uint256 vramMb, uint256 flopsTier);
    event WorkloadAttested(bytes32 indexed nodeId, bytes32 workloadHash, uint256 latencyMs);
    event NodeSlashed(bytes32 indexed nodeId, uint256 slashedAmount);

    error InsufficientStake();
    error NodeAlreadyExists();
    error Unauthorized();
    error NodeNotActive();

    function registerComputeNode(
        bytes32 nodeId,
        bytes32 hardwareFingerprint,
        uint256 vramMb,
        uint256 flopsTier
    ) external payable {
        if (msg.value < MIN_STAKE) revert InsufficientStake();
        if (nodes[nodeId].isCertified) revert NodeAlreadyExists();

        nodes[nodeId] = ComputeNode({
            operator: msg.sender,
            hardwareFingerprint: hardwareFingerprint,
            vramMb: vramMb,
            flopsTier: flopsTier,
            stakedAmount: msg.value,
            totalWorkloadsCompleted: 0,
            isCertified: true
        });

        totalActiveNodes++;
        emit NodeRegistered(nodeId, msg.sender, vramMb, flopsTier);
    }

    function submitComputeProof(
        bytes32 nodeId,
        bytes32 workloadHash,
        uint256 latencyMs
    ) external {
        ComputeNode storage node = nodes[nodeId];
        if (msg.sender != node.operator) revert Unauthorized();
        if (!node.isCertified) revert NodeNotActive();

        node.totalWorkloadsCompleted++;
        emit WorkloadAttested(nodeId, workloadHash, latencyMs);
    }
}
