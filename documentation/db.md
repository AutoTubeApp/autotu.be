# Database

[Neo4j documentation](https://neo4j.com/docs/)

## Installation

### Docker

```shell
docker pull neo4j
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    neo4j

```

## Usage

#### Select all

```shell
MATCH (n) RETURN n 
```

#### Drop DB (delete all nodes and relations)

```shell
MATCH (n) DETACH DELETE n
```

#### Create constraint

```shell
CREATE CONSTRAINT uniq_email IF NOT EXISTS
ON (n:User)
ASSERT n.email IS UNIQUE
```
