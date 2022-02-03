import _scproxy
import pymssql

import config


def db_connect():
    try:
        return pymssql.connect(server=config.server, user=config.username,
                               password=config.password, database=config.database)
    except pymssql.InterfaceError:
        print("A MSSQLDriverException has been caught.")

    except pymssql.DatabaseError:
        print("A MSSQLDatabaseException has been caught.")


def add_user(name, password):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addUser', (name, password,))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False
