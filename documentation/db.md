# Database

[Neo4j documentation](https://neo4j.com/docs/)

## Docker

### Installation

```shell
docker pull neo4j
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    neo4j
```

### Update

Dump DB before upgrading

```shell
docker run \
--publish=7474:7474 --publish=7687:7687 \
--volume=$HOME/neo4j/data:/data \ 
--env NEO4J_dbms_allow__upgrade=true \
 neo4j:4.4 
```

Remove old container 
```shell
docker rm neo4j_autotube
```

Rename new container
```shell
docker rename [new_name] neo4j_autotube
```



## Usage

### Select all

```shell
MATCH (n) RETURN n 
```

### Drop DB (delete all nodes and relations)

```shell
MATCH (n) DETACH DELETE n
```

### Create constraint

```shell
CREATE CONSTRAINT uniq_email IF NOT EXISTS
ON (u:User)
ASSERT u.email IS UNIQUE
```

## Schema

- Unique constraint: User.email, User.username

```shell
CREATE CONSTRAINT uniq_username IF NOT EXISTS
ON (u:User)
ASSERT u.username IS UNIQUE
```

