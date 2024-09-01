======LEIA-ME ANTES DE RODAR O PROJETO======

Este é um guia para rodar e utilizar as APIs providas pelo backend do projeto Compassio. Leia este documento se estiver com qualquer dúvida sobre como rodar o projeto, como fazer requisições, entre outros itens. LEIA COM ATENÇÃO.

    SOFTWARES E PACOTES REQUERIDOS PARA RODAR O PROJETO:

-Node.js ^20.0.0

-Npm ^10.0.0

-PostgreSQL 16 e extensão PostGIS

-PgAdmin 4 (Opcional porém recomendado)

-IDE a sua escolha

===========================================================================

    RODANDO O PROJETO PELA PRIMEIRA VEZ:

Após ter clonado o repositório na sua máquina e ter instalado os componentes necessários, siga estes passos:

1-Abra o projeto em sua IDE;

2-Abra o terminal na pasta principal do projeto;

3-No seu terminal, insira o comando 'npm i' e espere as dependências serem instaladas;

4-Na pasta principal do repositório, crie um arquivo com o nome '.env', esse arquivo serve para configurar sua conexão com o banco de dados;

5-No arquivo .env escreva esta linha e salve, mude os elementos sublinhados dependendo da configuração do seu banco de dados: DATABASE_URL="postgresql://postgres:senai@localhost:5432/postgres?schema=public&connection_limit=5" | | | | | | usuário senha porta de conexão (localhost:5432 é a padrão)

6-No seu terminal, insira o comando 'npx prisma migrate dev'. Insira 'y' ou 'yes' quando pedido e dê o nome que quiser para a migração. Este comando serve para atualizar seu banco de dados PostgreSQL com a configuração de tabelas mais recente.

7-No seu terminal, insira o comando 'npm run start:dev' ou 'npm run start'. Este comando inicia o servidor Nest em modo de desenvolvimento, aguarde até a verificação inicial terminar;

8-Em seu browser de preferência, acesse o link localhost:9000/api. Neste link você pode acessar as APIs pela interface Swagger.

===========================================================================

    UTILIZANDO AS APIS COM A INTERFACE DO SWAGGER

O Swagger é um conjunto de ferramentas utilizadas para melhor documentar e interagir com APIs em teste. Nós da Compassio o utilizamos como uma maneira fácil de fazer requisições para testes e documentação. Para utilizar a maioria das APIs você precisa estar autenticado no sistema com um dos quatro tipos de usuários:

-Admin

-Voluntário

-Ong

-Associado da Ong

O usuário admin é o único que pode fazer requisições para qualquer API. Todos os outros tem limites de acesso.

Para logar no sistema, você pode utilizar o usuário admin padrão (email e senha são os mesmos declarados no arquivo *.env*) ou criar um usuário de um dos tipos que você precisa, e então, seguir estes passos:

1-Clique na rota /auth/loginUser;

2-Clique no botão 'Try ot out' para editar a requisição;

3-Insira o email e a senha dentro das aspas;

4-Clique em executar;

5-Copie o token JWT gerado abaixo;

6-Clique no botão 'Authorize' no topo da página;

7-Cole o token o campo Value e clique em Authorize;

8-Clique em close.

Agora você está autorizado a fazer requisições no sistema.

===========================================================================

    BOAS PRÁTICAS E REPORT DE BUGS

-Sempre cheque se você tem tudo instalado corretamente antes de rodar o projeto

-Sempre cheque se sua requisição corresponde com o que é pedido pela API em questão de campos, tipo de dado, e quantidade

-Sempre cheque se o seu usuário está autorizado a fazer a requisição

-Para report de bugs, por favor contatar apenas os membros do time de Backend da Compassio, com uma explicação detalhada e um exemplo do erro para facilitar o processo

-Caso tenha sugestões para melhoria das APIs, por favor contatar apenas os membros do time de Backend da Compassio com uma explicação detalhada da mudança e do porquê da mudança

-Se o erro foi resultado de alguma mudança feita por conta própria na base de código, seu report não será considerado

-Qualquer tentativa de alteração na base de código e commitar para qualquer branch do projeto sem autorização de um membro do time de Backend da Compassio acarretará no bloqueio de acesso e possível banimento do projeto

===========================================================================

    O QUE VOCÊ IRÁ PRECISAR NO SEU ARQUIVO .env

-Url do Banco de Dados:
DATABASE_URL=""

-Email com server SMTP e senha para ações envolvendo envio de email
EMAIL=""
EMAILPASS=""

-Chave secreta para o JWT Token
JWTSECRET=""

-Chave secreta para encriptação
SECRETKEY=""

-Chave de API do Mapbox para uso do módulo Maps
MAP=""

-(Opcional) Chave de API do CnpjJá para checar CNPJs contra uma base de dados
CNPJ=""

-Chave de API para uso da Stripe com doações (em testes)
STRIPE="

========================================================================================================================

    VARIÁVEIS DO ARQUIVO .debug.env

-Se falso: Cria um usuário após código de verificação enviado por email ser inserido. Se verdadeiro: Cria um usuário sem
a verificação de email.

CREATE_USER_WITHOUT_EMAIL_VERIFY="false"

-Se falso: Faz verificação de validação do CNPJ da ONG. Se verdadeiro: Pula essa verificação e cria a ONG mesmo com um
CNPJ inválido.

CHECK_ONG_WITHOUT_CNPJ_VERIFY="false"

-Se falso: Não utiliza api do CNPJjá para validar CNPJ. Se verdadeiro: Faz a verificação do CNPJ pela API.
USE_API_FOR_CNPJ_VERIFY="false"

-Se falso: Faz verificação de validação do CPF do Voluntário ou dono da Ong. Se verdadeiro: Pula essa verificação e cria
o usuário mesmo o CPF sendo inválido.

CREATE_USER_WITHOUT_CPF_VERIFY="false"

===========================================================================
