
#!/bin/bash
set -e

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES
ON *.*
TO '${MYSQL_USER}'@'%';
SQL
