======LEIA-ME ANTES DE RODAR O PROJETO======

Este é um guia para rodar e utilizar as APIs providas pelo backend do projeto Compassio. Leia este documento
se estiver com qualquer dúvida sobre como rodar o projeto, como fazer requisições, entre outros itens. LEIA
COM ATENÇÃO.


1) SOFTWARES E PACOTES REQUERIDOS PARA RODAR O PROJETO:

-Node.js ^20.0.0

-Npm ^10.0.0

-PostgreSQL 16

-PgAdmin 4 (Opcional porém recomendado)

-IDE a sua escolha (preferencialmente Microsoft Visual Studio Code)


=====================================================================================================================================================

2) RODANDO O PROJETO PELA PRIMEIRA VEZ:

Após ter clonado o repositório na sua máquina e ter instalado os componentes necessários, siga estes passos:

1-Abra o projeto em sua IDE;

2-Abra o terminal na pasta principal do projeto;

3-No seu terminal, insira o comando 'npm i' e espere as dependências serem instaladas;

4-Na pasta principal do repositório, crie um arquivo com o nome '.env', esse arquivo serve para configurar sua
conexão com o banco de dados;

5-No arquivo .env escreva esta linha e salve, mude os elementos sublinhados dependendo da configuração do seu
banco de dados: DATABASE_URL="postgresql://postgres:senai@localhost:5432/postgres?schema=public&connection_limit=5"
                                              |       |           |
                                              |       |           |
                                            usuário  senha     porta de conexão
                                                          (localhost:5432 é a padrão)

6-No seu terminal, insira o comando 'npx prisma migrate dev'. Insira 'y' ou 'yes' quando pedido e dê o nome que quiser para a migração.
Este comando serve para atualizar seu banco de dados PostgreSQL com a configuração de tabelas mais recente.

7-No seu terminal, insira o comando 'npm run start:dev'. Este comando inicia o servidor Nest, aguarde até a verificação inicial terminar;

8-Em seu browser de preferência, acesse o link localhost:9000/api. Neste link você pode acessar as APIs pela interface Swagger.

=====================================================================================================================================================

3) UTILIZANDO AS APIS COM A INTERFACE DO SWAGGER

O Swagger é um conjunto de ferramentas utilizadas para melhor documentar e interagir com APIs em teste. Nós da Compassio o utilizamos como
uma maneira fácil de fazer requisições para testes e documentação. Para utilizar a maioria das APIs você precisa estar autenticado no sistema
com um dos quatro tipos de usuários:

-Admin

-Voluntário

-Ong

-Associado da Ong

O usuário admin é o único que pode fazer requisições para qualquer API. Todos os outros tem limites de acesso.

Para logar no sistema, você pode utilizar o usuário admin padrão (email: compassioAdm@compassio.com.br senha: admin123) ou criar um usuário de um dos tipos que você precisa,
e então, seguir estes passos:

1-Clique na rota /auth/loginUser;

2-Clique no botão 'Try ot out' para editar a requisição;

3-Insira o email e a senha dentro das aspas;

4-Clique em executar;

5-Copie o token JWT gerado abaixo;

6-Clique no botão 'Authorize' no topo da página;

7-Cole o token o campo Value e clique em Authorize;

8-Clique em close.

Agora você está autorizado a fazer requisições no sistema.

=====================================================================================================================================================

4) LISTA DE USUÁRIOS AUTOZIDADOS POR ROTA

=====================================================================================================================================================

5) BOAS PRÁTICAS E REPORT DE BUGS

-Sempre cheque se você tem tudo instalado corretamente antes de rodar o projeto

-Sempre cheque se sua requisição corresponde com o que é pedido pela API em questão de campos, tipo de dado, e quantidade

-Sempre cheque se o seu usuário está autorizado a fazer a requisição

-Para report de bugs, por favor contatar apenas os membros do time de Backend da Compassio, com uma explicação detalhada e um exemplo do erro para
facilitar o processo

-Caso tenha sugestões para melhoria das APIs, por favor contatar apenas os membros do time de Backend da Compassio com uma explicação detalhada da
mudança e do porquê da mudança

-Se o erro foi resultado de alguma mudança feita por conta própria na base de código, seu report não será considerado

-Qualquer tentativa de alteração na base de código e commitar para qualquer branch do projeto sem autorização de um membro do time de Backend da 
Compassio acarretará no bloqueio de acesso e possível banimento do projeto



<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
