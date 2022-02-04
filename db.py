import _scproxy
import pymssql
from pymssql import _mssql
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
                uid = pymssql.output(int)
                result = cursor.callproc('addUser', [name, password, None, uid])
                conn.commit()
                return result[3]
            except pymssql.DatabaseError as e:
                print(e)
                return e


def update_user(name, password):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateUser', (name, password,))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False


def add_game(name, releaseDate, price, description, download, version):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addGame', (version, releaseDate, price, description, download, name))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False


def add_UserOwnGames(uID, gID):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addUserOwnGame', (uID, gID))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False


def add_Review(uID, gID, title, content, rating):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addReview', (uID, gID, title, content, rating))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False


def update_Review(rID, title, content, rating):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateReview', (rID, title, content, rating))
                conn.commit()
                return True
            except pymssql.DatabaseError:
                print("Error in adding the User")
                return False


def get_AllGames():  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllGames', (1, 2))

                result = []
                for row in cursor:
                    result.append(row)

                conn.commit()

                return result
            except pymssql.DatabaseError as e:
                print(e)
                return False