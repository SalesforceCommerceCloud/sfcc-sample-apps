## @sfra

#### Temporary development solution to use Verdaccio as local npm repo
`npm config set @sfra:registry http://localhost:4873`

#### This project is a Monorepo (work in progress)

This means the sfra core, extensions and reference application are all managed, tested and versioned together in this single repository.
Packages which include core, services and extensions will be published and consumed as npm modules individually, but will be developed and managed under this single developer repository.  

#### Dependencies

The `packages` folder contains individual npm projects. 
Many will share common dependencies and lerna will be used to `HOIST` these
dependencies to the top level `node_modules` folder rather than each package
creating a copy of the dependencies. 

#### Setup
1) In this folder run `lerna bootstrap --hoist` (rather than npm install)
2) To build all the `packages` run `lerna run build --stream`
3) To `build` and `publish` and packages run `lerna run pub --stream` 
3) To add a shared dependecy to a `package` use the `lerna add dep1@version --scope=package1`. Use `--hoist` if the dependency is to be shared by more than one package.