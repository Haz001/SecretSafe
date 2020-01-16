SecretSafe
The xor 32768 bit encrypted notepad for now.

# Secret Safe

## Pros:
- Uses XOR encryption with a 32768 bit key
- Uses SHA3-512 to hash password to create key
- Imposible to crack if smaller than 32768 bits (1024 characters)

## Cons:
- Password is not salted and is only hashed once
- Large save files, save files can be 1.5 to 6 times larger than unencrypted couterpart
- Can only take notes
- No password check
- Can be cracked if charater length is a large multiple of 1024.

# How to setup
Install either `npm` or `yarn`<br/>
I use yarn but both work.

## Using npm
```bash
npm install
```

## Using yarn
```bash
yarn install
```

Now you can run!

# How to run
To run it you will need to install all dependencies, to do this please read "How to setup"

## Using npm
```bash
npm start
```

## Using yarn
```bash
yarn start
```
