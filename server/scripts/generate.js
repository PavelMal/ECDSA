const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");



const private = secp.utils.randomPrivateKey();

console.log("Private key: " + toHex(private));

const public = secp.getPublicKey(private);

console.log("Public key: " + toHex(public));

const address = keccak256(public.slice(1)).slice(-20);

console.log("ETH address: " + toHex(address));




const messageHash = toHex(keccak256(utf8ToBytes("test")));



(async () => {
    const signature = await secp.sign(messageHash, private, {recovered:true});

    const [sign, recoveryBit] = signature;
    console.log(signature);
    console.log("-----------");
    console.log(recoveryBit);

    console.log("----------");
    console.log("hashed signature");
    console.log(toHex(sign));

    let x = toHex(sign);


    const revoveredPublic = secp.recoverPublicKey(messageHash, x, 1);
    console.log("recovered public key: " + toHex(revoveredPublic));

    const address = keccak256(revoveredPublic.slice(1)).slice(-20);

    console.log("ETH address from recovered : " + toHex(address));  
})();


//                                                          TEST DATA
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private key: 860633452b845ddcb72547bb07d109d1b7e8f414d2e76dd623e08e0ea902cb78
// Public key: 04bfe74f8e39014e667b5d73e7e33a83f75d33688919a6f7d2235fe89aea4b54781924fcca383a65acfe7b04e3b9817cbed66710510a39a61ec8203f90bd72f99f
// ETH address: d5e6f8e14a1e5e50d4b9c3fa09c486ba0e4e3f24
// Hexed signature: 3045022100dfdaf07e1a96dd477aca7c0964c32a0ae88be5d38f2b4bd1fdba47e29a98ebbd022033cd7a9cf0a1fdecfb9459eebc0cebfb973c6b8790eb79bed41ef603b7ed6b94
// recovery: 1

// Private key: bb417c96dabdb8588a60680aa0355711a1b65f21b2c0349d0f46405af24681ba
// Public key: 04bbd670960a620a769c4eb7933f7203884261b42a689eac9dc6998d729e6f26840b800c6c266399f5c5dcd733acdc81813adc296a404adda9b6e620abe4467109
// ETH address: 1f991a6f523f410ad172b7ee5ff1a1624116be29
// Hexed signature: 3044022066799515075445eb55d0af934b38c7d60c37403956461998a483e7f01bb9003b02201762b4cb14cd00cb55b421d7f7633c21d6421be6a9d6e61a5680daa3a762b714
// recovery: 1


// Private key: dec8486270e011cdfe4f5f38942a78e6c029282019fd4708bd52b59bec0d86ce
// Public key: 04ca8ef26671c2663397493734b23dbc1e64467ab897cec607463b274aa73075ec02d92e6ce50d16a6324be636f52968e8313f0a93e29d0ce273a81bc2da183049
// ETH address: 872590e820afcc4399136787df748941ef717993
// Hexed signature: 304502210092990c7f5034c482e0151dc28eea91f7482172e9fc93ad28087a7f88d693fe71022027bf81149e22b962079e1bc97edd3275205c774603d821f88902bc412500c969
// recovery: 1