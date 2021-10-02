export const address = "";
export const ABI = [{
        "inputs": [{
            "components": [{
                    "internalType": "address",
                    "name": "employee",
                    "type": "address"
                },
                {
                    "internalType": "address[]",
                    "name": "currencies",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "internalType": "struct IEquity.Employee[]",
            "name": "_list",
            "type": "tuple[]"
        }],
        "name": "addList",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "employee",
            "type": "address"
        }],
        "name": "remove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "employee",
            "type": "address"
        }],
        "name": "returnRemoved",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sendList",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
        }],
        "name": "setEquityContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_oracle",
            "type": "address"
        }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "equity",
        "outputs": [{
            "internalType": "contract IEquity",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "employeeId",
            "type": "uint256"
        }],
        "name": "getCurrencies",
        "outputs": [{
            "components": [{
                    "internalType": "address",
                    "name": "currency",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "internalType": "struct List.Currency[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "list",
        "outputs": [{
            "internalType": "address",
            "name": "employee",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oracle",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "removedEmployees",
        "outputs": [{
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timeWhenRemoved",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unlockTime",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]