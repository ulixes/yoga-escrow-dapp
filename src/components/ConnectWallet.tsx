import { useConnect, useConnectors } from 'wagmi';

export default function ConnectWallet() {
  const { connect } = useConnect();
  const connectors = useConnectors();

  return (
    <div className="connect-wallet">
      <h2>Connect Your Wallet</h2>
      <p>Connect your wallet to start using the yoga class escrow service</p>
      <div className="wallet-options">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="wallet-button"
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}