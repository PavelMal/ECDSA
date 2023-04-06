const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xd5e6f8e14a1e5e50d4b9c3fa09c486ba0e4e3f24": 100,
  "0x1f991a6f523f410ad172b7ee5ff1a1624116be29": 50,
  "0x872590e820afcc4399136787df748941ef717993": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const messageHash = toHex(keccak256(utf8ToBytes("test")));

  let revoveredPublic;
  try {
    revoveredPublic = secp.recoverPublicKey(messageHash, signature, Number(recovery));

  } catch (error) {
    res.status(400).send({ message: "Something is not right" });
  }

  const prefix = "0x";

  const recoveredAddress = toHex(keccak256(revoveredPublic.slice(1)).slice(-20));

  const stringRecAddr = recoveredAddress.toString();

  const fullAddress = prefix + stringRecAddr;

  if (new Map(Object.entries(balances)).has(fullAddress)) {
    if (balances[fullAddress] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[fullAddress] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Unknown wallet" });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function checkSignature(signature) {

   const recPubKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);
}
