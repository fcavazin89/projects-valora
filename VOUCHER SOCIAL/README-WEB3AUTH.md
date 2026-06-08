# Configuração do Web3Auth

## Status Atual

O aplicativo está funcionando em **modo demo** (sem blockchain real) porque o Web3Auth não está configurado.

## Como Configurar o Web3Auth

### 1. Criar Conta no Web3Auth

1. Acesse: https://dashboard.web3auth.io/
2. Faça login ou crie uma conta
3. Clique em "Create Project"

### 2. Configurar o Projeto

1. **Nome do projeto:** Voucher Social
2. **Network:** Selecione **Sapphire Mainnet** (ou Testnet para testes)
3. **Verifier:** Pode usar o padrão ou configurar custom
4. **Whitelist URLs:** Adicione:
   - `http://localhost:3000` (para desenvolvimento)
   - Sua URL de produção (ex: `https://seu-app.vercel.app`)

### 3. Obter o Client ID

1. Após criar o projeto, copie o **Client ID**
2. Ele terá um formato similar a: `BEy2uSC8d0lo_rK5hfbu4b84zJxyv-mi9N5ndYhyTsqa487lzPTGYtKDKeDqFAYf9dm22FdkHACbxhxLZxNYKmg`

### 4. Adicionar ao Projeto

Edite o arquivo `.env.local` e adicione:

```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=seu_client_id_aqui
```

### 5. Reiniciar o Servidor

```bash
# Parar o servidor (Ctrl + C)
# Iniciar novamente
pnpm dev
```

## Modo Demo vs Modo Blockchain

### Modo Demo (sem Web3Auth)
- ✅ Interface funcional
- ✅ Todos os fluxos de UI
- ✅ QR codes de demonstração
- ❌ Transações não vão para blockchain
- ❌ Saldos são simulados

### Modo Blockchain (com Web3Auth)
- ✅ Carteira real conectada
- ✅ Transações na blockchain Sepolia
- ✅ Saldos reais de tokens ERC-1155
- ✅ Assinatura de transações
- ✅ Histórico on-chain

## Configuração Avançada

Se quiser customizar ainda mais, edite `lib/web3/web3auth-config.ts`:

```typescript
const web3AuthContextConfig: Web3AuthContextConfig | null = isValidClientId
  ? {
      web3AuthOptions: {
        clientId: clientId!,
        web3AuthNetwork: "sapphire_mainnet", // ou "sapphire_devnet"
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0xaa36a7", // Sepolia testnet
          rpcTarget: "https://rpc.ankr.com/eth_sepolia",
          displayName: "Ethereum Sepolia",
          blockExplorerUrl: "https://sepolia.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
      },
    }
  : null
```

## Troubleshooting

### Erro: "Project not found"
- Verifique se o Client ID está correto
- Confirme que está usando a rede correta (mainnet vs testnet)
- Verifique se o domínio está na whitelist

### Erro: "Invalid configuration"
- Limpe o cache: deletar pasta `.next`
- Reinicie o servidor
- Limpe o cache do browser (Ctrl + Shift + R)

## Suporte

- Web3Auth Docs: https://web3auth.io/docs/
- Dashboard: https://dashboard.web3auth.io/
