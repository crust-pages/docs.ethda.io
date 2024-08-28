"use strict";(self.webpackChunkethda_docs=self.webpackChunkethda_docs||[]).push([[4527],{8022:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var o=n(5893),r=n(1151);const a={id:"integrate-with-zkblob",title:"",hide_table_of_contents:!1},s=void 0,i={id:"developers/integrate-with-zkblob",title:"",description:"Rollups can use zkBlob for DA by posting their data to EthDA and then proving that it was posted on Ethereum. This turtorial will define a demo rollup which will outline a very simple zkBlob rollup to illustrate at a high level what this could look like.",source:"@site/docs/developers/integrate-with-zkblob.md",sourceDirName:"developers",slug:"/developers/integrate-with-zkblob",permalink:"/developers/integrate-with-zkblob",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"integrate-with-zkblob",title:"",hide_table_of_contents:!1},sidebar:"mySidebar",previous:{title:"Upload & Download Blobs",permalink:"/developers/upload-and-download-blobs"},next:{title:"EthDA Contracts",permalink:"/resources/ethda-contracts"}},l={},c=[{value:"Define a rollup",id:"define-a-rollup",level:2},{value:"Rollup sequencer",id:"rollup-sequencer",level:2},{value:"Committing to data",id:"committing-to-data",level:3},{value:"Creating blocks",id:"creating-blocks",level:3},{value:"Rollup Synchronizer node",id:"rollup-synchronizer-node",level:2},{value:"Downloading the block",id:"downloading-the-block",level:3}];function h(e){const t={code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.p,{children:"Rollups can use zkBlob for DA by posting their data to EthDA and then proving that it was posted on Ethereum. This turtorial will define a demo rollup which will outline a very simple zkBlob rollup to illustrate at a high level what this could look like."}),"\n",(0,o.jsx)(t.h2,{id:"define-a-rollup",children:"Define a rollup"}),"\n",(0,o.jsx)(t.p,{children:"The first step to starting a new rollup is to define the structure of the commitments that each block consists of."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-go",children:"type Sequence struct {\n  // Rollup block number\n  BatchNumber uint64\n  // Data store to DA \n  BatchL2Data []byte\n  // Prev block hash\n  PrevBlockHash [32]byte\n}\n\n"})}),"\n",(0,o.jsxs)(t.p,{children:["Note the EthDA-specific structure called the ",(0,o.jsx)(t.code,{children:"dataAvailabilityMessage"}),", which is used to locate the data in the EthDA batch so that we can prove that data's inclusion via zkBlob if needed. ",(0,o.jsx)(t.code,{children:"dataAvailabilityMessage"})," defined as []byte"]}),"\n",(0,o.jsx)(t.h2,{id:"rollup-sequencer",children:"Rollup sequencer"}),"\n",(0,o.jsx)(t.p,{children:"The rollup sequence sender is responsible for creating blocks and writing block transaction data to EthDA and Ethereum. The rollup synchronizer node is responsible for reading that transaction data from EthDA and verify it."}),"\n",(0,o.jsx)(t.p,{children:"We can start by first defining the interfaces of EthDA and Ethereum networks that rollup nodes need to use."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-go",children:"// DABackender is an interface for components that store and retrieve batch data\ntype DABackender interface {\n\tSequenceRetriever\n\tSequenceSender\n\t// Init initializes the DABackend\n\tInit() error\n}\n\ntype dataAbilitier interface {\n\tPostSequence(ctx context.Context, sequences []ethmanTypes.Sequence) ([]byte, error)\n}\n\n// SequenceSender is used to send provided sequence of batches\ntype SequenceSender interface {\n\t// PostSequence sends the sequence data to the data availability backend, and returns the dataAvailabilityMessage\n\t// as expected by the contract\n\tPostSequence(ctx context.Context, batchesData [][]byte) ([]byte, error)\n}\n\n// SequenceRetriever is used to retrieve batch data\ntype SequenceRetriever interface {\n\t// GetSequence retrieves the sequence data from the data availability backend\n\tGetSequence(ctx context.Context, batchHashes []common.Hash, dataAvailabilityMessage []byte) ([][]byte, error)\n}\n"})}),"\n",(0,o.jsx)(t.p,{children:"Here we are waiting for the blob tx to be rollup to Ethereum, however, it would likely be better to simply download that blobs from EthDA instead."}),"\n",(0,o.jsx)(t.p,{children:"A rollup synchronizer node will just consist of some representation of a blockchain along with clients to read from with EthDA and Ethereum."}),"\n",(0,o.jsx)(t.h3,{id:"committing-to-data",children:"Committing to data"}),"\n",(0,o.jsx)(t.p,{children:"Typical blockchains commit to the transactions included in each block using a Merkle root. Rollups that use zkBlob for DA need to use the commitments that are relayed to the zkBlob contracts. For optimistic rollups, this could be as simple as referencing the data in the EthDA batch. For zk rollups, this would involve creating an inclusion proof to the blob span in the zkBlob contracts and then verifying that proof in the zk proof used to verify state."}),"\n",(0,o.jsx)(t.h3,{id:"creating-blocks",children:"Creating blocks"}),"\n",(0,o.jsxs)(t.p,{children:["The first step in creating a block is to post the block data to EthDA. Upon confirmation of the blob tx, This ",(0,o.jsx)(t.code,{children:"dataAvailabilityMessage"})," can be used by contracts on Ethereum that use the zkBlob contracts to prove some specific data was included."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-go",children:'func (d *EthdaBackend) PostSequence(ctx context.Context, batchesData [][]byte) ([]byte, error) {\n\tvar hashes []byte\n\tfor _, batch := range batchesData {\n\t\thash, err := d.ethdaClient.PostBlob(ctx, batch)\n\t\tif err != nil {\n\t\t\treturn nil, fmt.Errorf("post batch to ethda: %w", err)\n\t\t}\n\t\thashes = append(hashes, hash.Bytes()...)\n\t\tlog.Infof("Post da to ethda: %s", hash.Hex())\n\t}\n\n\tcurrentHash := common.Hash{}.Bytes()\n\tfor _, batchData := range batchesData {\n\t\ttypes := []string{\n\t\t\t"bytes32",\n\t\t\t"bytes32",\n\t\t}\n\t\tvalues := []interface{}{\n\t\t\tcurrentHash,\n\t\t\tcrypto.Keccak256(batchData),\n\t\t}\n\t\tcurrentHash = solsha3.SoliditySHA3(types, values)\n\t}\n\n\tsig, err := d.ethdaClient.SignBatchHash(common.BytesToHash(currentHash))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\treturn append(sig, hashes...), nil\n}\n'})}),"\n",(0,o.jsx)(t.p,{children:"Note that the sequence sender here is not yet posting sequences to Ethereum. This is because the sequencer is waiting for the EthDA batches to be relayed to the contracts. Once the contracts are updated, the sequencer can post the header to Ethereum."}),"\n",(0,o.jsx)(t.h2,{id:"rollup-synchronizer-node",children:"Rollup Synchronizer node"}),"\n",(0,o.jsx)(t.h3,{id:"downloading-the-block",children:"Downloading the block"}),"\n",(0,o.jsx)(t.p,{children:"There are a few different mechanisms that could be used to download blocks. The simplest solution and what is outlined above is for rollup synchronizer node to wait until the dataAvailabilityMessages are posted to the respective chains, and then download each as they are posted. It would also be possible to gossip the headers ahead of time and download the rollup data from EthDA instead of waiting for the headers to be posted to Ethereum."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-go",children:'func (d *EthdaBackend) GetSequence(ctx context.Context, batchHashes []common.Hash, dataAvailabilityMessage []byte) ([][]byte, error) {\n\tmsgLen := len(dataAvailabilityMessage)\n\n\tif msgLen < crypto.SignatureLength || (msgLen-crypto.SignatureLength)%common.HashLength != 0 {\n\t\treturn nil, fmt.Errorf("wrong da message length: %d", msgLen)\n\t}\n\n\tvar data [][]byte\n\tfor i := 0; i < (msgLen-crypto.SignatureLength)/common.HashLength; i++ {\n\t\tstart := common.HashLength*i + crypto.SignatureLength\n\t\thash := common.BytesToHash(dataAvailabilityMessage[start : start+common.HashLength])\n\n\t\tr, err := d.ethdaClient.GetBlob(hash)\n\t\tif err != nil {\n\t\t\treturn nil, fmt.Errorf("get blob from ethda: %w", err)\n\t\t}\n\t\tdata = append(data, r)\n\t}\n\treturn data, nil\n}\n\nfunc (cli *Client) GetBlob(hash common.Hash) ([]byte, error) {\n\trj, err := json.Marshal(map[string]interface{}{\n\t\t"method":  "eth_getTransactionByHash",\n\t\t"id":      "1",\n\t\t"jsonrpc": "2.0",\n\t\t"params":  []string{hash.Hex()},\n\t})\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\tresp, err := http.Post(cli.rpcUrl, "application/json", bytes.NewBuffer(rj))\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\tvar rpcTx *rpcTransaction\n\tif err := json.NewDecoder(resp.Body).Decode(&rpcTx); err != nil {\n\t\treturn nil, fmt.Errorf("decode response, %w", err)\n\t}\n\tblobs := rpcTx.Result.Sidecar.Blobs\n\n\tvar r []byte\n\tfor _, blob := range blobs {\n\t\tb := DecodeBlob(common.Hex2Bytes(strings.TrimPrefix(blob, "0x")))\n\t\tr = append(r, b...)\n\t}\n\n\treturn r, nil\n}\n'})}),"\n",(0,o.jsx)(t.p,{children:"This outline of a zkBlob rollup isn't doing execution or state transitions induced by the transactions, however, that step would occur here. If fraud is detected, the fraud proof process will begin. The only difference between the fraud proof process of a normal optimistic rollup and a rollup that uses zkBlob for DA is that the full node would first prove the fraudulent transaction was committed to by the Sequencer using the Span in the header and before proceeding with the normal process."})]})}function d(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>s});var o=n(7294);const r={},a=o.createContext(r);function s(e){const t=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(a.Provider,{value:t},e.children)}}}]);