# Batch verify constacts project

This project just to migrate database of contracts verifications in scan

## How to use it
- First install requirement using 
  ```shell 
  npm i
  ```

- Modify your env
  ```shell
  cp ./.env.example ./env
  ```
   - the `url` is the scan verify rpc
   - the `connection` is the database token

- Start it with
    ```shell 
    npm run start -- index
    ```
  `index` means the index number, set it 0 when first run

  Sometimes it will break, and output error message due to unstable network, you will get the abort index, just run with it like this
  ```shell
  Abort in index 5
  npm run start -- 5
  ``` 