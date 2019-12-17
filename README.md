SecretSafe
The xor 512 bit encrypted notepad for now.

# Secret Safe

## Pros:
- Uses XOR encryption with a 512 bit key
- Uses SHA3-512 to hash password to create key
- Imposible to crack if smaller than 512 bits (73 characters)

## Cons:
- Password is not salted and is only hashed once
- Can only take notes
- No password check
- Only ASCII

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
