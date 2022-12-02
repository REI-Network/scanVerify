import { QueryTypes, Sequelize } from "sequelize";
import { colorConsole } from "tracer";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const logger = colorConsole();
const sequelize = new Sequelize(process.env.connection, {
  logging: (msg) => logger.log(msg),
});

(async () => {
  const addr = process.argv[2];
  const results = await sequelize.query(
    "SELECT * FROM smart_contracts WHERE address_hash = `x${addr}`",
    {
      type: QueryTypes.SELECT,
    }
  );
  const inputJson: any = {
    language: "Solidity",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata",
          ],
          "": ["ast"],
        },
      },
    },
  };
  console.log("contracts count:", results.length);
  let sources: any = {};
  for (let i = 0; i <= results.length; i++) {
    sources[(results[i] as any).file_name] = {
      content: (results[i] as any).contract_source_code,
    };
  }
  inputJson.sources = sources;
  fs.writeFileSync(`${addr}.json`, JSON.stringify(inputJson));
})();
