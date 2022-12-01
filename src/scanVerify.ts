import { QueryTypes, Sequelize } from "sequelize";
import { colorConsole } from "tracer";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const logger = colorConsole();
const sequelize = new Sequelize(process.env.connection, {
  logging: (msg) => logger.log(msg),
});

(async () => {
  const results = await sequelize.query(
    "SELECT * FROM smart_contracts ORDER BY inserted_at",
    {
      type: QueryTypes.SELECT,
    }
  );
  console.log("contracts count:", results.length);

  type datatype = {
    addressHash: any;
    compilerVersion: any;
    contractSourceCode: any;
    name: any;
    optimization: any;
    optimizationRuns?: any;
    constructorArguments?: any;
  };

  const index = Number(process.argv[2]);
  for (let i = index; i < results.length; i++) {
    const contracData: datatype = {
      addressHash: "0x" + (results[i] as any).address_hash.toString("hex"),
      compilerVersion: (results[i] as any).compiler_version,
      contractSourceCode: (results[i] as any).contract_source_code,
      name: (results[i] as any).name,
      optimization: (results[i] as any).optimization,
    };
    if ((results[i] as any).optimization_runs) {
      contracData.optimizationRuns = Number(
        (results[i] as any).optimization_runs
      );
    }
    if ((results[i] as any).constructor_arguments) {
      contracData.constructorArguments = (
        results[i] as any
      ).constructor_arguments;
    }
    try {
      console.log("contractData is", contracData);
      const message_result = await axios({
        method: "post",
        url: process.env.url,
        data: contracData,
      });
      console.log(
        "sucessed index:",
        i,
        "contract name:",
        (results[i] as any).name,
        "state:",
        message_result.data.message,
        "contract address:",
        "0x" + (results[i] as any).address_hash.toString("hex")
      );
    } catch (error) {
      console.log(error);
      console.log("Abort in index", i);
      return;
    }
  }
})();
