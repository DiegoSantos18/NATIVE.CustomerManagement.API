# 🗄️ Guia de Configuração do Banco de Dados (MySQL)

Este documento descreve como configurar, rodar e gerenciar o ambiente de banco de dados MySQL local para a API do projeto **Native Customer Management**, utilizando Docker Compose.

---

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](../docker-compose.yml) instalados e em execução na sua máquina.

**Docker Desktop**
![Docker Desktop](docker_desktop.png)

- Um cliente de banco de dados (recomeda-se o **[DBeaver](https://dbeaver.io/download/)** ou a extensão **[Database Client](https://database-client.com/)** no VS Code, verifique a sessão de [Sugestões de Extensões](../.vscode/extensions.json)) ou utilize algum outro de sua preferência.

**DBeaver**
![DBeaver - principal](dbeaver_principal.png)
Configure a conexão, baixe os drivers se pedir
![DBeaver - driver](dbeaver_driver.png)
OBS.: se ocorrer um erro 'Public Key Retrieval is not allowed' ao testar conexão, mude 'allowPublicKeyRetrieval' para 'true'. Por padrão, quando a conexão não utiliza SSL (como no caso do localhost no Docker), o driver JDBC do MySQL no DBeaver bloqueia a busca automática da chave pública RSA do servidor para proteger a senha.

**Database Client**
![Database Client](database_client.png)
Aqui geralmente não tem problemas para conectar, bom por ser integrado ao VS Code não necessita de instalar outra ferramenta.

---

## ⚙️ Configuração das Variáveis de Ambiente

Antes de subir o container, certifique-se de que o seu arquivo `.env` na raiz da API está configurado com base no `.env.example`.

Exemplo de configuração utilizada:

```env
NODE_ENV=development
PORT=3000

# Configurações do MySQL (docker-compose)
DB=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=native_customer_db
DB_ROOT_PASSWORD=root
DB_USER=root
DB_PASSWORD=root

# String de Conexão (Prisma ORM)
DATABASE_URL="${DB}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
```

---

**Após configurar o .env suba o container Docker**

Execute na raiz da pasta o comando (para mais comandos acesse [Docker Help](https://docs.docker.com/compose/intro/compose-application-model/))

```bash
docker compose up -d
```

OU utilize o atalho da extensão, disponível também em [Sugestões de Extensões](../.vscode/extensions.json)

![Container Tools](container_tools.png)
