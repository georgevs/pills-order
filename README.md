# Pills order

## Run the app locally

### Install live certificates
```
openssl enc -aes-128-cbc -pbkdf2 -salt -d -in ~/ws-archive/certs.tar.gz.enc | tar xzv
```
### Start web server in Docker
```
docker container run --rm \
  --name node-app \
  --network bridge-dev \
  --ip 172.20.0.100 \
  --user node \
  --workdir /home/node \
  --volume "$PWD/app:/home/node/app" \
  --volume "$PWD/certs:/home/node/certs" \
  --publish 3443:3443 \
  -d node npx http-server ./app -c-1 --ssl -p 3443 --cert ./certs/cert.pem --key ./certs/cert-key-nopassword.pem

```
Open site at https://xps.spamfro.site:3443 (in LAN) or https://local.spamfro.site:3443 (with forward proxy)

## Run the app in GitHub pages

### Push source subtree into GitHub
```
git subtree split -P playground/pills-order -b github/pills-order
git push git@github.com:spamfro/pills-order.git github/pills-order:main
```

### Deploy to GitHub pages
```
mkdir -p dist 
rm -rf dist/* dist/.*
tar -cC app . | tar -xvC dist
pushd dist
touch .nojekyll
git init -b gh-pages
git add --all
git commit -m "$(date)"
git push git@github.com:spamfro/pills-order.git --force gh-pages
popd
```
Open site at https://spamfro.site/pills-order
